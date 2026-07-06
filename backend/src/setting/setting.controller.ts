import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Tạo cấu hình website thành công!')
  async create(
    @Body() dto: CreateSettingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.settingService.create(dto, file);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Cập nhật cấu hình website thành công!')
  async update(
    @Body() dto: UpdateSettingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.settingService.update(dto, file);
  }
}
