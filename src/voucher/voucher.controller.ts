import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { AssignVoucherDto } from './dtos/assign-voucher.dto';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { GetMyVouchersDto } from './dtos/get-my-voucher.dto';
import { GetVouchersAdminDto } from './dtos/get-voucher-admin.dto';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getMyVouchers(
    @CurrentUser('sub') userId: string,
    @Query() query: GetMyVouchersDto,
  ) {
    const data = await this.voucherService.getMyVouchers(userId, query);

    return {
      message: 'Lấy danh sách voucher thành công!',
      data,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getVouchersAdmin(@Query() query: GetVouchersAdminDto) {
    const data = await this.voucherService.getVouchersAdmin(query);

    return {
      message: 'Lấy danh sách voucher thành công!',
      data,
    };
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createVoucher(@Body() dto: CreateVoucherDto) {
    const data = await this.voucherService.createVoucher(dto);

    return {
      message: 'Tạo voucher thành công',
      data,
    };
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async assignVoucher(
    @Body() dto: AssignVoucherDto,
    @Param('id', new ParseUUIDPipe()) voucherId: string,
  ) {
    const data = await this.voucherService.assignVoucherToUsers(voucherId, dto);
    return {
      message: 'Gửi voucher thành công!',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateVoucher(
    @Param('id', new ParseUUIDPipe()) voucherId: string,
    @Body() dto: UpdateVoucherDto,
  ) {
    const data = await this.voucherService.updateVoucher(voucherId, dto);

    return {
      message: 'Cập nhật voucher thành công!',
      data,
    };
  }
}
