import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dtos/create-product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { UpdateProductVariantDto } from './dtos/update-product-variant.dto';
import { Prisma, ProductVariant } from '@prisma/client';

@Injectable()
export class ProductVariantService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findById(variantId: string, options?: { includeProduct?: boolean }) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: options?.includeProduct ?? false,
      },
    });
  }

  async findByProductId(productId: string) {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        color: true,
        attributes: true,
        attributesHash: true,
        images: true,
        imagePublicIds: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return variants.map((variant) => ({
      ...variant,
      attributes:
        typeof variant.attributes === 'string'
          ? JSON.parse(variant.attributes)
          : variant.attributes,
    }));
  }

  /*================ Case create ================*/
  private normalizeAttributes(
    attributes?: Record<string, string | number>,
  ): string | null {
    if (!attributes || Object.keys(attributes).length === 0) {
      return null;
    }

    const sortedKeys = Object.keys(attributes).sort();

    const normalizedObject = sortedKeys.reduce(
      (acc, key) => {
        acc[key] = attributes[key];
        return acc;
      },
      {} as Record<string, string | number>,
    );

    return JSON.stringify(normalizedObject);
  }

  //Validate product existence and active status
  private async validateProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (!product.isActive) {
      throw new BadRequestException('Sản phẩm đã bị vô hiệu hóa');
    }

    return product;
  }

  //Resolve variant images from either Cloudinary uploads or external image URLs
  private async resolveCreateVariantImages(
    files?: Express.Multer.File[],
    imageUrls?: string[],
  ) {
    const hasFiles = (files?.length ?? 0) > 0;
    const hasImageUrls = (imageUrls?.length ?? 0) > 0;

    if (!hasFiles && !hasImageUrls) {
      throw new BadRequestException('Phải upload ảnh hoặc cung cấp URL ảnh');
    }

    if (hasFiles && hasImageUrls) {
      throw new BadRequestException(
        'Chỉ được upload ảnh hoặc cung cấp URL ảnh, không được dùng đồng thời',
      );
    }

    if (hasFiles) {
      const uploads = await this.cloudinaryService.uploadMultipleImages(
        files!,
        'product-variants',
      );

      return {
        images: uploads.map((i) => i.secure_url),
        imagePublicIds: uploads.map((i) => i.public_id),
      };
    }

    return {
      images: imageUrls!,
      imagePublicIds: [],
    };
  }

  //Convert attributes to Prisma JSON value.
  private buildAttributes(attributes?: Record<string, string | number>) {
    return attributes && Object.keys(attributes).length > 0
      ? attributes
      : Prisma.JsonNull;
  }

  //Convert Prisma unique constraint error into business exception.
  private handleVariantDuplicateError(error: any): never {
    if (error.code === 'P2002') {
      throw new BadRequestException('Biến thể sản phẩm đã tồn tại');
    }

    throw error;
  }

  //create
  async create(dto: CreateProductVariantDto, files: Express.Multer.File[]) {
    await this.validateProduct(dto.productId);

    const normalizedAttributes = this.normalizeAttributes(dto.attributes);

    const { images, imagePublicIds } = await this.resolveCreateVariantImages(
      files,
      dto.imageUrls,
    );

    const attributes = this.buildAttributes(dto.attributes);

    try {
      return await this.prisma.productVariant.create({
        data: {
          productId: dto.productId,
          color: dto.color,

          attributes,
          attributesHash: normalizedAttributes,

          images,
          imagePublicIds,

          stock: dto.stock ?? 0,
        },
      });
    } catch (error) {
      this.handleVariantDuplicateError(error);
    }
  }

  /*================ Case update ================*/

  //Find variant by id or throw not found exception.
  private async getVariantOrThrow(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException('Biến thể không tồn tại');
    }

    return variant;
  }

  //Validate that request does not mix Cloudinary uploads and external image URLs.
  private validateImageSourceConflict(
    files?: Express.Multer.File[],
    imageUrls?: string[],
  ) {
    if (files?.length && imageUrls?.length) {
      throw new BadRequestException(
        'Chỉ được upload ảnh hoặc cung cấp URL ảnh, không được dùng đồng thời',
      );
    }
  }

  /**
   * Process variant images based on its current image source.
   * Supports Cloudinary variants and external URL variants.
   */
  private async processVariantImages(
    variant: ProductVariant,
    dto: UpdateProductVariantDto,
    files?: Express.Multer.File[],
  ) {
    const isCloudinaryVariant = variant.imagePublicIds.length > 0;

    let images = [...variant.images];
    let imagePublicIds = [...variant.imagePublicIds];
    let uploadedPublicIds: string[] = [];

    if (isCloudinaryVariant) {
      if (dto.imageUrls?.length) {
        throw new BadRequestException(
          'Biến thể này đang sử dụng ảnh Cloudinary',
        );
      }

      if (dto.removeImagePublicIds?.length) {
        const validPublicIds = dto.removeImagePublicIds.filter((id) =>
          imagePublicIds.some((pubId) => pubId.endsWith(id)),
        );

        const fullPublicIdsToRemove = validPublicIds.map(
          (id) => imagePublicIds.find((pubId) => pubId.endsWith(id))!,
        );

        await Promise.all(
          fullPublicIdsToRemove.map((publicId) =>
            this.cloudinaryService.deleteImage(publicId),
          ),
        );

        const newImages: string[] = [];
        const newPublicIds: string[] = [];

        for (let i = 0; i < imagePublicIds.length; i++) {
          if (!fullPublicIdsToRemove.includes(imagePublicIds[i])) {
            newImages.push(images[i]);
            newPublicIds.push(imagePublicIds[i]);
          }
        }

        images = newImages;
        imagePublicIds = newPublicIds;
      }

      if (files?.length) {
        const uploads = await this.cloudinaryService.uploadMultipleImages(
          files,
          'product-variants',
        );

        images.push(...uploads.map((i) => i.secure_url));
        imagePublicIds.push(...uploads.map((i) => i.public_id));

        uploadedPublicIds = uploads.map((i) => i.public_id);
      }
    } else {
      if (dto.removeImagePublicIds?.length) {
        throw new BadRequestException('Biến thể này không sử dụng Cloudinary');
      }

      if (files?.length) {
        throw new BadRequestException(
          'Biến thể này đang sử dụng URL ảnh ngoài',
        );
      }

      if (dto.imageUrls !== undefined) {
        images = dto.imageUrls;
      }
    }

    return {
      images,
      imagePublicIds,
      uploadedPublicIds,
    };
  }

  //Recompute attributes and attributes hash when variant attributes change.
  private buildUpdatedAttributes(
    variant: ProductVariant,
    dto: UpdateProductVariantDto,
  ) {
    let attributes:
      | Prisma.InputJsonValue
      | Prisma.NullableJsonNullValueInput
      | undefined = variant.attributes as Prisma.InputJsonValue;

    let attributesHash = variant.attributesHash;

    if (dto.attributes !== undefined) {
      const isEmpty = Object.keys(dto.attributes).length === 0;

      attributes = isEmpty
        ? Prisma.JsonNull
        : (dto.attributes as Prisma.InputJsonValue);

      attributesHash = isEmpty
        ? null
        : this.normalizeAttributes(dto.attributes);
    }

    return {
      attributes,
      attributesHash,
    };
  }

  //Ensure variant still contains at least one image.
  private validateVariantImages(images: string[]) {
    if (images.length === 0) {
      throw new BadRequestException('Biến thể phải có ít nhất 1 ảnh');
    }
  }

  //Remove uploaded Cloudinary images when database update fails
  private async rollbackUploadedImages(uploadedPublicIds: string[]) {
    if (!uploadedPublicIds.length) {
      return;
    }

    await Promise.all(
      uploadedPublicIds.map((id) => this.cloudinaryService.deleteImage(id)),
    );
  }

  async update(
    id: string,
    dto: UpdateProductVariantDto,
    files?: Express.Multer.File[],
  ) {
    const variant = await this.getVariantOrThrow(id);

    this.validateImageSourceConflict(files, dto.imageUrls);

    const { images, imagePublicIds, uploadedPublicIds } =
      await this.processVariantImages(variant, dto, files);

    this.validateVariantImages(images);

    const { attributes, attributesHash } = this.buildUpdatedAttributes(
      variant,
      dto,
    );

    try {
      return await this.prisma.productVariant.update({
        where: { id },
        data: {
          color: dto.color ?? variant.color,

          attributes,
          attributesHash,

          stock: dto.stock ?? variant.stock,

          images,
          imagePublicIds,
        },
      });
    } catch (error) {
      await this.rollbackUploadedImages(uploadedPublicIds);

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Biến thể với màu sắc và thuộc tính này đã tồn tại',
        );
      }

      throw error;
    }
  }
}
