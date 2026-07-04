import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { DashboardRevenueFilterDto } from './dto/dashboard-revenue.dto';
import { DashboardTopProductsFilterDto } from './dto/dashboard-top-product.dto';
import { DashboardOrderStatusDto } from './dto/dashboard-order-status.dto';
import { DashboardMonthlyOrderItemDto } from './dto/dashboard-month-order.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy thống kê tổng quan thành công')
  async getOverview() {
    return await this.dashboardService.getOverview();
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy thống kê doanh thu thành công')
  async getRevenue(@Query() query: DashboardRevenueFilterDto) {
    return await this.dashboardService.getRevenue(query);
  }

  @Get('top-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy danh sách sản phẩm nổi bật thành công')
  async getTopProducts(@Query() query: DashboardTopProductsFilterDto) {
    return await this.dashboardService.getTopProducts(query);
  }

  @Get('top-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy thống kê trạng thái đơn hàng thành công')
  getOrderStatus(): Promise<DashboardOrderStatusDto> {
    return this.dashboardService.getOrderStatus();
  }

  @Get('monthly-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Lấy thống kê số lượng đơn hàng theo tháng thành công')
  getMonthlyOrders(
    @Query() query: DashboardRevenueFilterDto,
  ): Promise<DashboardMonthlyOrderItemDto[]> {
    return this.dashboardService.getMonthlyOrders(query);
  }
}
