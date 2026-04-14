import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { CreateVnpayPaymentDto } from './dtos/create-payment.dto';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('vnpay')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPayment(
    @CurrentUser('sub') userId: string,
    @Body() body: CreateVnpayPaymentDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const data = await this.paymentService.createVnpayPayment(
      userId,
      body.orderId,
      ipAddr,
    );

    return {
      data,
    };
  }

  @Get('vnpay/ipn')
  async handleVnpayIpn(@Query() query: VnpayQueryRaw) {
    const result = await this.paymentService.handleVnpayIpn(query);
    return result;
  }

  @Get('vnpay/return')
  async handleVnpayReturn(@Query() query: VnpayQueryRaw) {
    const result = await this.paymentService.handleVnpayReturn(query);

    return result;
  }
}
