import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { AssignVoucherDto } from './dtos/assign-voucher.dto';

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
}
