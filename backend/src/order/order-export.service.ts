import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { Workbook } from 'exceljs';
import { ORDER_STATUS_LABEL } from './mapper/order-status.mapper';

@Injectable()
export class OrderExportService {
  constructor(private readonly prisma: PrismaService) {}

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

  async exportOrders(status?: OrderStatus): Promise<Workbook> {
    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
    };

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException('Không có đơn hàng để xuất');
    }

    const workbook = new Workbook();

    workbook.creator = 'Mini E-commerce';
    workbook.created = new Date();

    const orderSheet = workbook.addWorksheet('Orders');
    const itemSheet = workbook.addWorksheet('Order Items');

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

    const headerRow = orderSheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

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

    /* Order items */
    itemSheet.columns = [
      { header: 'Mã đơn', key: 'orderId', width: 40 },
      { header: 'Tên sản phẩm', key: 'productName', width: 35 },
      { header: 'Phân loại', key: 'variant', width: 30 },
      { header: 'Số lượng', key: 'quantity', width: 12 },
      { header: 'Đơn giá', key: 'price', width: 18 },
      { header: 'Thành tiền', key: 'total', width: 18 },
    ];

    const itemHeaderRow = itemSheet.getRow(1);

    itemHeaderRow.font = {
      bold: true,
    };

    itemHeaderRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

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

    return workbook;
  }
}
