import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /*Case create */
  // Validate only one website setting exists.
  private async validateSettingNotExists() {
    const setting = await this.prisma.setting.findFirst({
      select: { id: true },
    });

    if (setting) {
      throw new BadRequestException('Cấu hình website đã tồn tại');
    }
  }

  // Resolve logo from either Cloudinary upload or external URL.
  private async resolveCreateLogo(
    file?: Express.Multer.File,
    logoUrl?: string,
  ) {
    const hasFile = !!file;
    const hasLogoUrl = !!logoUrl;

    if (hasFile && hasLogoUrl) {
      throw new BadRequestException(
        'Chỉ được upload logo hoặc cung cấp URL logo, không được dùng đồng thời',
      );
    }

    if (hasFile) {
      const upload = await this.cloudinaryService.uploadImage(file, 'settings');

      return {
        logo: upload.secure_url,
        logoPublicId: upload.public_id,
      };
    }

    return {
      logo: logoUrl ?? null,
      logoPublicId: null,
    };
  }

  // Create
  async create(dto: CreateSettingDto, file?: Express.Multer.File) {
    await this.validateSettingNotExists();

    const { logo, logoPublicId } = await this.resolveCreateLogo(file, dto.logo);

    return this.prisma.setting.create({
      data: {
        siteName: dto.siteName,

        logo,
        logoPublicId,

        email: dto.email,

        hotline1: dto.hotline1,
        hotline2: dto.hotline2,

        address: dto.address,

        workingHours: dto.workingHours,

        facebookUrl: dto.facebookUrl,
        youtubeUrl: dto.youtubeUrl,
        tiktokUrl: dto.tiktokUrl,
        zaloUrl: dto.zaloUrl,

        googleMapUrl: dto.googleMapUrl,
      },
    });
  }

  /*Case update */
  private async getSettingOrThrow() {
    const setting = await this.prisma.setting.findFirst();

    if (!setting) {
      throw new NotFoundException('Cấu hình website không tồn tại');
    }

    return setting;
  }

  private async resolveUpdateLogo(
    current: {
      logo: string | null;
      logoPublicId: string | null;
    },
    dto: UpdateSettingDto,
    file?: Express.Multer.File,
  ) {
    const hasFile = !!file;
    const hasLogoUrl = dto.logo !== undefined;

    if (hasFile && hasLogoUrl) {
      throw new BadRequestException(
        'Chỉ được upload logo hoặc cung cấp URL logo, không được dùng đồng thời',
      );
    }

    // Không cập nhật logo
    if (!hasFile && !hasLogoUrl) {
      return {
        logo: current.logo,
        logoPublicId: current.logoPublicId,
      };
    }

    // Upload logo mới
    if (hasFile) {
      const upload = await this.cloudinaryService.uploadImage(file, 'settings');

      if (current.logoPublicId) {
        await this.cloudinaryService.deleteImage(current.logoPublicId);
      }

      return {
        logo: upload.secure_url,
        logoPublicId: upload.public_id,
      };
    }

    // Cập nhật bằng URL hoặc xóa logo
    if (current.logoPublicId) {
      await this.cloudinaryService.deleteImage(current.logoPublicId);
    }

    return {
      logo: dto.logo ?? null,
      logoPublicId: null,
    };
  }

  async update(dto: UpdateSettingDto, file?: Express.Multer.File) {
    const setting = await this.getSettingOrThrow();

    const { logo, logoPublicId } = await this.resolveUpdateLogo(
      {
        logo: setting.logo,
        logoPublicId: setting.logoPublicId,
      },
      dto,
      file,
    );

    return this.prisma.setting.update({
      where: {
        id: setting.id,
      },
      data: {
        ...dto,
        logo,
        logoPublicId,
      },
    });
  }

  /*Case get */
  async findOne() {
    return this.getSettingOrThrow();
  }
}
