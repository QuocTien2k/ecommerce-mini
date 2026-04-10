import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateVoucherDto } from './dtos/create-voucher.dto';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

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
}
