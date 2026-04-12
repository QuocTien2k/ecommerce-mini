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
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UpdateOrderStatusDto } from './dtos/update-order.dto';
import { GetOrdersQueryDto } from './dtos/get-orders.dto';
import { OrderMapper } from './mapper/order.mapper';

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
    const order = await this.ordersService.createOrder(userId, dto);

    return {
      message: 'Tạo đơn hàng thành công',
      data: OrderMapper.toDetail(order),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) orderId: string,
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

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(
    @Query() query: GetOrdersQueryDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.getOrders(query, userId, role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrderDetail(
    @Param('id', new ParseUUIDPipe()) orderId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.getOrderDetail(orderId, userId, role);
  }
}
