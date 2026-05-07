import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminUserQuery } from './types/admin-user.type';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @Roles(Role.ADMIN)
  async getUsers(@Query() query: AdminUserQuery) {
    return this.adminService.getUsers(query);
  }

  @Patch(':id/lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async lockUser(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.adminService.setUserActiveStatus(userId, false, currentUserId);
  }

  @Patch(':id/unlock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async unLockUser(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @CurrentUser('sub') currentUserId: string,
  ) {
    return this.adminService.setUserActiveStatus(userId, true, currentUserId);
  }
}
