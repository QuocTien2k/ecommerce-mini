import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import {
  DashboardRevenueFilterDto,
  DashboardRevenueItemDto,
  RevenueRow,
} from './dto/dashboard-revenue.dto';
import {
  DashboardTopProductDto,
  DashboardTopProductMetric,
  DashboardTopProductsFilterDto,
  TopProductRow,
} from './dto/dashboard-top-product.dto';
import { DashboardOrderStatusDto } from './dto/dashboard-order-status.dto';
import {
  DashboardMonthlyOrderItemDto,
  MonthlyOrderRow,
} from './dto/dashboard-month-order.dto';

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
    query: DashboardRevenueFilterDto,
  ): Promise<DashboardRevenueItemDto[]> {
    const year = query.year ?? new Date().getFullYear();

    const rows = await this.prisma.$queryRaw<RevenueRow[]>`
    SELECT EXTRACT(MONTH FROM "createdAt")::int AS month, COALESCE(SUM("totalPrice"), 0)::float AS revenue
    FROM "orders" WHERE "status" = ${OrderStatus.DELIVERED}::"OrderStatus" AND EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY EXTRACT(MONTH FROM "createdAt") ORDER BY month;`;

    const revenueMap = new Map(rows.map((item) => [item.month, item.revenue]));

    return Array.from({ length: 12 }, (_, index) => ({
      label: `T${index + 1}`,
      revenue: revenueMap.get(index + 1) ?? 0,
    }));
  }

  // case lấy top sản phẩm bán chạy (top-products)
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

    const statuses = [
      Prisma.sql`${OrderStatus.CONFIRMED}::"OrderStatus"`,
      Prisma.sql`${OrderStatus.PROCESSING}::"OrderStatus"`,
      Prisma.sql`${OrderStatus.READY_TO_SHIP}::"OrderStatus"`,
      Prisma.sql`${OrderStatus.SHIPPING}::"OrderStatus"`,
      Prisma.sql`${OrderStatus.DELIVERED}::"OrderStatus"`,
    ];

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
      WHERE o.status IN (${Prisma.join(statuses)})
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

  //case order status
  async getOrderStatus(): Promise<DashboardOrderStatusDto> {
    const rows = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const result: DashboardOrderStatusDto = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      readyToShip: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const row of rows) {
      switch (row.status) {
        case OrderStatus.PENDING:
          result.pending = row._count.status;
          break;

        case OrderStatus.CONFIRMED:
          result.confirmed = row._count.status;
          break;

        case OrderStatus.PROCESSING:
          result.processing = row._count.status;
          break;

        case OrderStatus.READY_TO_SHIP:
          result.readyToShip = row._count.status;
          break;

        case OrderStatus.SHIPPING:
          result.shipping = row._count.status;
          break;

        case OrderStatus.DELIVERED:
          result.delivered = row._count.status;
          break;

        case OrderStatus.CANCELLED:
          result.cancelled = row._count.status;
          break;
      }
    }

    return result;
  }

  //
  async getMonthlyOrders(
    query: DashboardRevenueFilterDto,
  ): Promise<DashboardMonthlyOrderItemDto[]> {
    const year = query.year ?? new Date().getFullYear();

    const rows = await this.prisma.$queryRaw<MonthlyOrderRow[]>`
    SELECT
      EXTRACT(MONTH FROM "createdAt")::int AS month,
      COUNT(*)::int AS orders
    FROM "orders"
    WHERE
      EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY EXTRACT(MONTH FROM "createdAt")
    ORDER BY month;
  `;

    const orderMap = new Map(rows.map((item) => [item.month, item.orders]));

    return Array.from({ length: 12 }, (_, index) => ({
      label: `T${index + 1}`,
      orders: orderMap.get(index + 1) ?? 0,
    }));
  }
}

// GET /dashboard/monthly-orders
