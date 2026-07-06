import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { PrismaModule } from '@prisma/prisma.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
