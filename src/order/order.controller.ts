import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UpdateOrderStatusDto } from './dtos/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser('sub') userId: string,
  ) {
    return await this.ordersService.createOrder(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const updated = await this.ordersService.updateOrderStatus(
      orderId,
      dto.status,
    );

    return {
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updated,
    };
  }
}
