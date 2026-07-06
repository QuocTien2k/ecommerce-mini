import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';

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
}
