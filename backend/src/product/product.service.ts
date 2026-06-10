import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { toSlug } from '@common/utils/slug';
import { UpdateProductDto } from './dtos/update-product.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { GetProductsQueryDto } from './dtos/get-product.dto';
import { Prisma } from '@prisma/client';
import { ProductVariantService } from 'src/product-variant/product-variant.service';
import { CategoryService } from '@category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private productVariantService: ProductVariantService,
  ) {}

  private async toggleActive(id: string, isActive: boolean) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, isActive: true, deletedAt: true },
    });

    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (existing.isActive === isActive) {
      return existing;
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive, deletedAt: isActive ? null : new Date() },
    });
  }

  calcDiscountPrice(price: number, pct?: number): number | null {
    if (!pct) return null;

    return Math.floor(price * (1 - pct / 100));
  }

  async create(dto: CreateProductDto, userId: string) {
    //check category
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Danh mục không tồn tại!');
    }

    const hasChildren = await this.prisma.category.findFirst({
      where: { parentId: category.id, deletedAt: null },
      select: { id: true },
    });

    if (hasChildren) {
      throw new BadRequestException('Chỉ được tạo sản phẩm ở danh mục cuối');
    }

    //check brand
    const brand = await this.prisma.brand.findUnique({
      where: { id: dto.brandId },
    });

    if (!brand) {
      throw new BadRequestException('Thương hiệu không tồn tại!');
    }

    //discount input
    const discountPrice = this.calcDiscountPrice(dto.price, dto.discountPct);

    //logic giá
    if (discountPrice != null && discountPrice >= dto.price) {
      throw new BadRequestException('Giá giảm không hợp lệ');
    }

    //Slug
    const baseSlug = toSlug(dto.name);
    let attempt = 0;

    while (attempt < 5) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

      try {
        return await this.prisma.product.create({
          data: {
            name: dto.name,
            slug,
            description: dto.description,

            price: dto.price.toString(),
            discountPrice: discountPrice?.toString(),
            discountPct: dto.discountPct ?? null,

            isActive: dto.isActive ?? true,

            categoryId: dto.categoryId,
            brandId: dto.brandId,
            creatorId: userId,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];

          if (target?.includes('slug')) {
            attempt++;
            continue;
          }
        }

        throw error;
      }
    }

    throw new ConflictException('Không thể tạo slug duy nhất');
  }

  async update(id: string, dto: UpdateProductDto) {
    //Check
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    //Validate category
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Danh mục không tồn tại!');
      }
    }

    //Validate brand
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });

      if (!brand) {
        throw new BadRequestException('Brand không tồn tại!');
      }
    }

    //undefinded => giữ disocunt, null=> xóa, number => cập nhật
    const price = dto.price ?? Number(existing.price);

    let pct: number | null;

    if (dto.discountPct === null) {
      pct = null;
    } else if (dto.discountPct !== undefined) {
      pct = dto.discountPct;
    } else {
      pct = existing.discountPct;
    }

    //Calc discountPrice
    const discountPrice =
      pct !== null && pct !== undefined
        ? this.calcDiscountPrice(price, pct)
        : null;

    //logic giá
    if (discountPrice != null && discountPrice >= price) {
      throw new BadRequestException('Giá giảm không hợp lệ');
    }

    const data: any = {
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,

      price: price.toString(),
      discountPrice: discountPrice?.toString() ?? null,
      discountPct: pct,

      isActive: dto.isActive ?? existing.isActive,

      categoryId: dto.categoryId ?? existing.categoryId,
      brandId: dto.brandId ?? existing.brandId,
    };

    //Handle slug
    if (dto.slug) {
      const baseSlug = toSlug(dto.slug);

      // nếu slug không đổi → skip
      if (baseSlug === existing.slug) {
        data.slug = existing.slug;
      } else {
        let attempt = 0;

        while (attempt < 5) {
          const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;

          try {
            return await this.prisma.product.update({
              where: { id },
              data: {
                ...data,
                slug,
              },
            });
          } catch (error) {
            if (error.code === 'P2002') {
              const target = error.meta?.target as string[];

              if (target?.includes('slug')) {
                attempt++;
                continue;
              }
            }

            throw error;
          }
        }

        throw new ConflictException('Không thể tạo slug duy nhất');
      }
    }

    //Không update slug
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  restore(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  //lists product for user
  async findAllProducts(query: GetProductsQueryDto) {
    // pagination (default limit = 10)
    const { page, limit, skip } = getPagination({
      ...query,
      limit: query.limit ?? 10,
    });

    // build where condition
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    if (query.categoryId) {
      const categoryIds = await this.categoryService.getAllDescendantIds(
        query.categoryId,
      );

      where.categoryId = {
        in: categoryIds,
      };
    }

    let breadcrumb: {
      id: string;
      name: string;
      parentId: string | null;
    }[] = [];
    if (query.categoryId) {
      breadcrumb = await this.categoryService.getAncestors(query.categoryId);
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    const search = query.search?.trim();

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.priceSort
          ? { price: query.priceSort }
          : { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,

          price: true,
          discountPrice: true,
          discountPct: true,

          ratingAvg: true,
          ratingCount: true,

          isActive: true,

          categoryId: true,
          brandId: true,

          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    //convert decimal -> string
    const mappedData = data.map((item) => ({
      ...item,
      price: item.price.toString(),
      discountPrice: item.discountPrice?.toString() ?? null,
    }));

    // format response
    const response = buildPaginatedResponse(mappedData, total, page, limit);

    return {
      ...response,
      breadcrumb,
    };
  }

  //detail for user
  async findProductDetail(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        creator: {
          select: { id: true, fullname: true },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Sản phẩm không tìm thấy');
    }

    const variants = await this.productVariantService.findByProductId(
      product.id,
    );

    // filter + map variants cho user
    const mappedVariants = variants.map((v) => ({
      id: v.id,
      color: v.color,
      attributes: v.attributes,
      images: v.images,
      stock: v.stock,
    }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,

      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() ?? null,
      discountPct: product.discountPct,

      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,

      category: product.category,
      creator: product.creator,

      variants: mappedVariants,
    };
  }

  //latest products for home page
  async getHomeProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discountPrice: true,
        discountPct: true,
        ratingAvg: true,
        ratingCount: true,
      },
    });

    return products.map((item) => ({
      ...item,
      price: item.price.toString(),
      discountPrice: item.discountPrice?.toString() ?? null,
    }));
  }

  //lists product for admin
  async findAllForAdmin(query: GetProductsQueryDto) {
    const { page, limit, skip } = getPagination({
      ...query,
      limit: query.limit ?? 6,
    });

    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    const search = query.search?.trim();

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // admin filter isActive
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.priceSort
          ? { price: query.priceSort }
          : { createdAt: 'desc' },

        select: {
          id: true,
          name: true,
          slug: true,
          description: true,

          price: true,
          discountPrice: true,
          discountPct: true,

          ratingAvg: true,
          ratingCount: true,

          isActive: true,
          deletedAt: true,
          categoryId: true,
          brandId: true,

          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.product.count({ where }),
    ]);

    // map Decimal -> string
    const mappedData = data.map((item) => ({
      ...item,
      price: item.price.toString(),
      discountPrice: item.discountPrice?.toString() ?? null,
    }));

    return buildPaginatedResponse(mappedData, total, page, limit);
  }

  //detail for admin
  async findOneForAdmin(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: { id: true, name: true, slug: true, variantType: true },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        creator: { select: { id: true, fullname: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Sản phẩm có id ${productId} không tìm thấy!`,
      );
    }

    const variants =
      await this.productVariantService.findByProductId(productId);

    return {
      ...product,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() ?? null,
      variants,
    };
  }
}
