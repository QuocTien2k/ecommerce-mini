import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Request,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  getMe(@Request() req) {
    return this.userService.getMe(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('profile')
  async updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('password')
  async updatePassword(@Req() req, @Body() body: ChangePasswordDto) {
    return this.userService.updatePassword(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(req.user.sub, file);
  }
}
