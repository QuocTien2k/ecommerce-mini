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
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { GetVoucherDetailAdminDto } from './dtos/voucher-detail.dto';
import { GetAvailableVouchersQueryDto } from './dtos/get-available-voucher.dto';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ResponseMessage('Lấy danh sách voucher thành công!')
  async getMyVouchers(
    @CurrentUser('sub') userId: string,
    @Query() query: GetMyVouchersDto,
  ) {
    return await this.voucherService.getMyVouchers(userId, query);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getAvailableVouchers(
    @CurrentUser('sub') userId: string,
    @Query() query: GetAvailableVouchersQueryDto,
  ) {
    return this.voucherService.getAvailableVouchers(userId, query.subtotal);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh sách voucher thành công!')
  async getVouchersAdmin(@Query() query: GetVouchersAdminDto) {
    return await this.voucherService.getVouchersAdmin(query);
  }

  @Get(':voucherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy chi tiết voucher thành công!')
  async getVoucherDetail(@Param() dto: GetVoucherDetailAdminDto) {
    return this.voucherService.getVoucherDetailForAdmin(dto.voucherId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Tạo voucher thành công!')
  async createVoucher(@Body() dto: CreateVoucherDto) {
    return await this.voucherService.createVoucher(dto);
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Gửi voucher thành công!')
  async assignVoucher(
    @Body() dto: AssignVoucherDto,
    @Param('id', new ParseUUIDPipe()) voucherId: string,
  ) {
    return await this.voucherService.assignVoucherToUsers(voucherId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Cập nhật voucher thành công!')
  async updateVoucher(
    @Param('id', new ParseUUIDPipe()) voucherId: string,
    @Body() dto: UpdateVoucherDto,
  ) {
    return await this.voucherService.updateVoucher(voucherId, dto);
  }

  @Patch('soft/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Xóa voucher thành công!')
  async softDelete(@Param('id', new ParseUUIDPipe()) voucherId: string) {
    return await this.voucherService.softDeleteVoucher(voucherId);
  }
}
