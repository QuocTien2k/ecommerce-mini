import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { Workbook, Row } from 'exceljs';
import { ORDER_STATUS_LABEL } from './mapper/order-status.mapper';

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  };
}>;

@Injectable()
export class OrderExportService {
  constructor(private readonly prisma: PrismaService) {}

  /* handle name for download filename */
  private buildFileName(status?: OrderStatus): string {
    const date = new Date().toISOString().slice(0, 10);

    return `orders-${status?.toLowerCase() ?? 'all'}-${date}.xlsx`;
  }

  getExportFileName(status?: OrderStatus): string {
    return this.buildFileName(status);
  }

  /* style header in excell */
  private styleHeader(row: Row): void {
    row.font = {
      bold: true,
      size: 12,
      color: {
        argb: 'FFFFFFFF',
      },
    };

    row.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: '2563EB',
      },
    };

    row.height = 24;

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
      };
    });
  }

  private formatSelectedAttributes(
    attributes: Prisma.JsonValue | null,
  ): string {
    if (!attributes || typeof attributes !== 'object') {
      return '';
    }

    return Object.entries(attributes as Record<string, string>)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  private async getOrders(status?: OrderStatus): Promise<OrderWithItems[]> {
    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
    };

    return this.prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });
  }

  private createWorkbook(): Workbook {
    const workbook = new Workbook();

    workbook.creator = 'Mini E-commerce';
    workbook.created = new Date();

    return workbook;
  }

  private buildOrderSheet(workbook: Workbook, orders: OrderWithItems[]): void {
    const orderSheet = workbook.addWorksheet('Orders');

    orderSheet.columns = [
      { header: 'Mã đơn', key: 'id', width: 40 },
      { header: 'Trạng thái', key: 'status', width: 20 },
      { header: 'Người nhận', key: 'receiverName', width: 25 },
      { header: 'Số điện thoại', key: 'receiverPhone', width: 18 },
      { header: 'Địa chỉ', key: 'receiverAddress', width: 40 },
      { header: 'Số sản phẩm', key: 'itemCount', width: 15 },
      { header: 'Tạm tính', key: 'subtotal', width: 18 },
      { header: 'Giảm giá', key: 'discountAmount', width: 18 },
      { header: 'Thành tiền', key: 'totalPrice', width: 18 },
      { header: 'Voucher', key: 'voucherCode', width: 20 },
      { header: 'Ghi chú', key: 'note', width: 30 },
      { header: 'Ngày tạo', key: 'createdAt', width: 25 },
    ];

    orderSheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    orderSheet.autoFilter = {
      from: 'A1',
      to: 'L1',
    };

    this.styleHeader(orderSheet.getRow(1));

    for (const order of orders) {
      orderSheet.addRow({
        id: order.id,
        status: ORDER_STATUS_LABEL[order.status],
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverAddress: order.receiverAddress,
        itemCount: order.items.length,
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discountAmount),
        totalPrice: Number(order.totalPrice),
        voucherCode: order.voucherCode ?? '',
        note: order.note ?? '',
        createdAt: order.createdAt,
      });
    }

    orderSheet.getColumn('subtotal').numFmt = '#,##0';
    orderSheet.getColumn('discountAmount').numFmt = '#,##0';
    orderSheet.getColumn('totalPrice').numFmt = '#,##0';
    orderSheet.getColumn('createdAt').numFmt = 'dd/mm/yyyy hh:mm';
  }

  private buildOrderItemSheet(
    workbook: Workbook,
    orders: OrderWithItems[],
  ): void {
    const itemSheet = workbook.addWorksheet('Order Items');

    itemSheet.columns = [
      { header: 'Mã đơn', key: 'orderId', width: 40 },
      { header: 'Tên sản phẩm', key: 'productName', width: 35 },
      { header: 'Phân loại', key: 'variant', width: 30 },
      { header: 'Số lượng', key: 'quantity', width: 12 },
      { header: 'Đơn giá', key: 'price', width: 18 },
      { header: 'Thành tiền', key: 'total', width: 18 },
    ];

    itemSheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    itemSheet.autoFilter = {
      from: 'A1',
      to: 'F1',
    };

    this.styleHeader(itemSheet.getRow(1));

    for (const order of orders) {
      for (const item of order.items) {
        itemSheet.addRow({
          orderId: order.id,
          productName: item.productName,
          variant: this.formatSelectedAttributes(item.selectedAttributes),
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.price) * item.quantity,
        });
      }
    }

    itemSheet.getColumn('price').numFmt = '#,##0';
    itemSheet.getColumn('total').numFmt = '#,##0';
  }

  async exportOrders(status?: OrderStatus): Promise<Workbook> {
    const orders = await this.getOrders(status);

    if (!orders.length) {
      throw new NotFoundException('Không có đơn hàng để xuất');
    }

    const workbook = this.createWorkbook();

    this.buildOrderSheet(workbook, orders);
    this.buildOrderItemSheet(workbook, orders);

    return workbook;
  }
}
