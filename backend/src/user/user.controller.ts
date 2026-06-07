import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('sub') userId: string) {
    return this.userService.getMe(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('profile')
  @ResponseMessage('Cập nhật thành công!')
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('password')
  @ResponseMessage('Đổi mật khẩu thành công!')
  async updatePassword(
    @CurrentUser('sub') userId: string,
    @Body() body: ChangePasswordDto,
  ) {
    return this.userService.updatePassword(userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Cập nhật avatar thành công!')
  async uploadAvatar(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(userId, file);
  }
}
