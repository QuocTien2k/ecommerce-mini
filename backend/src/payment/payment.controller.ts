import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { CreateVnpayPaymentDto } from './dtos/create-payment.dto';
import { Request } from 'express';
import { MomoIpnDto, MomoReturnDto } from './types/momo.type';
import { Role } from '@prisma/client';
import { Roles } from '@auth/decorators/roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('vnpay')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
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

    return data;
  }

  @Post('momo/:orderId')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  async createMomoPayment(
    @CurrentUser('sub') userId: string,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    return this.paymentService.createMomoPayment(userId, orderId);
  }

  @Post('momo/ipn')
  async handleMomoIpn(@Body() body: MomoIpnDto) {
    return this.paymentService.handleMomoIpn(body);
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

  @Get('momo/return')
  async handleMomoReturn(@Query() query: MomoReturnDto) {
    return this.paymentService.handleMomoReturn(query);
  }

  @Get('status/:id')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(
    @Param('id', new ParseUUIDPipe()) orderId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return await this.paymentService.getPaymentStatus(userId, orderId);
  }
}
