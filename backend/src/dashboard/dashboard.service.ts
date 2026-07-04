import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import {
  DashboardRevenueilterDto,
  DashboardRevenueItemDto,
} from './dto/dashboard-revenue.dto';
import { RevenueRow } from './types/revenue.type';
import {
  DashboardTopProductDto,
  DashboardTopProductMetric,
  DashboardTopProductsFilterDto,
} from './dto/dashboard-top-product.dto';
import { TopProductRow } from './types/top-product.type';

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
    query: DashboardRevenueilterDto,
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

  // case lấy top sản phẩm bán chạy
  private mapTopProducts(rows: TopProductRow[]): DashboardTopProductDto[] {
    return rows.map((row) => ({
      productId: row.productId,
      name: row.name,
      thumbnail: row.thumbnail,
      value: Number(row.value),
    }));
  }

  private async getTopRatedProducts(
    limit: number,
  ): Promise<DashboardTopProductDto[]> {
    const rows = await this.prisma.$queryRaw<TopProductRow[]>`
      SELECT
        id AS "productId",
        name,
        thumbnail,
        "ratingAvg"::float AS value
      FROM "products"
      WHERE
        "deletedAt" IS NULL
        AND "ratingCount" > 0
      ORDER BY value DESC
      LIMIT ${limit};
    `;

    return this.mapTopProducts(rows);
  }

  private async getTopProductsBySalesMetric(
    metric: DashboardTopProductMetric,
    days: number,
    limit: number,
  ): Promise<DashboardTopProductDto[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const valueSql = this.getMetricSql(metric);

    const rows = await this.prisma.$queryRaw<TopProductRow[]>(Prisma.sql`
      SELECT
        p.id AS "productId",
        p.name,
        p.thumbnail,
        ${valueSql} AS value
      FROM "order_items" oi
      INNER JOIN "orders" o
        ON oi."orderId" = o.id
      INNER JOIN "products" p
        ON oi."productId" = p.id
      WHERE
        o.status IN (
          ${OrderStatus.CONFIRMED},
          ${OrderStatus.PROCESSING},
          ${OrderStatus.READY_TO_SHIP},
          ${OrderStatus.SHIPPING},
          ${OrderStatus.DELIVERED}
        )
        AND o."createdAt" >= ${fromDate}
        AND p."deletedAt" IS NULL
      GROUP BY
        p.id,
        p.name,
        p.thumbnail
      ORDER BY value DESC
      LIMIT ${limit};
    `);

    return this.mapTopProducts(rows);
  }

  private getMetricSql(metric: DashboardTopProductMetric): Prisma.Sql {
    switch (metric) {
      case DashboardTopProductMetric.QUANTITY:
        return Prisma.sql`SUM(oi.quantity)::float`;

      case DashboardTopProductMetric.REVENUE:
        return Prisma.sql`SUM(oi.quantity * oi.price)::float`;

      case DashboardTopProductMetric.ORDERS:
        return Prisma.sql`COUNT(DISTINCT oi."orderId")::float`;

      default:
        throw new BadRequestException('Loại thống kê không hợp lệ.');
    }
  }

  async getTopProducts(
    query: DashboardTopProductsFilterDto,
  ): Promise<DashboardTopProductDto[]> {
    const metric = query.metric ?? DashboardTopProductMetric.QUANTITY;

    const days = query.days ?? 7;
    const limit = query.limit ?? 10;

    switch (metric) {
      case DashboardTopProductMetric.RATING:
        return this.getTopRatedProducts(limit);

      case DashboardTopProductMetric.QUANTITY:
      case DashboardTopProductMetric.REVENUE:
      case DashboardTopProductMetric.ORDERS:
        return this.getTopProductsBySalesMetric(metric, days, limit);
    }
  }
}

// GET /dashboard/top-products
// GET /dashboard/order-status
// GET /dashboard/monthly-orders
