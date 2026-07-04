import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { OrderStatus } from '@prisma/client';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { DashboardRevenueItemDto } from './dto/dashboard-revenue.dto';

type RevenueRow = {
  month: number;
  revenue: number;
};

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  //tổng quan
  async getOverview(): Promise<DashboardOverviewDto> {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      expectedRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),

      this.prisma.order.count(),

      this.prisma.order.count({
        where: {
          status: OrderStatus.PENDING,
        },
      }),

      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          totalPrice: true,
        },
      }),

      this.prisma.order.aggregate({
        where: {
          status: {
            in: [
              OrderStatus.CONFIRMED,
              OrderStatus.PROCESSING,
              OrderStatus.READY_TO_SHIP,
              OrderStatus.SHIPPING,
            ],
          },
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: Number(totalRevenue._sum.totalPrice ?? 0),
      expectedRevenue: Number(expectedRevenue._sum.totalPrice ?? 0),
    };
  }

  // Thống kê doanh thu theo từng tháng trong năm
  async getRevenue(
    query: DashboardFilterDto,
  ): Promise<DashboardRevenueItemDto[]> {
    const year = query.year ?? new Date().getFullYear();

    const rows = await this.prisma.$queryRaw<RevenueRow[]>`
    SELECT
      EXTRACT(MONTH FROM "createdAt")::int AS month,
      COALESCE(SUM("totalPrice"), 0)::float AS revenue
    FROM "orders"
    WHERE
      "status" = ${OrderStatus.DELIVERED}
      AND EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY EXTRACT(MONTH FROM "createdAt")
    ORDER BY month;
  `;

    const revenueMap = new Map(rows.map((item) => [item.month, item.revenue]));

    return Array.from({ length: 12 }, (_, index) => ({
      label: `T${index + 1}`,
      revenue: revenueMap.get(index + 1) ?? 0,
    }));
  }
}

// GET /dashboard/top-products
// GET /dashboard/order-status
// GET /dashboard/monthly-orders
