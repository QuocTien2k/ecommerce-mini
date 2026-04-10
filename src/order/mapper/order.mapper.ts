import { Order, OrderItem } from '@prisma/client';
import { ORDER_STATUS_LABEL } from './order-status.mapper';

type OrderWithItems = Order & {
  items: OrderItem[];
};

export class OrderMapper {
  static toDetail(order: OrderWithItems) {
    return {
      id: order.id,
      status: order.status,
      statusLabel: ORDER_STATUS_LABEL[order.status],

      pricing: {
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        totalPrice: order.totalPrice,
      },

      voucher: order.voucherCode
        ? {
            code: order.voucherCode,
            type: order.voucherType,
            value: order.voucherValue,
          }
        : null,

      receiver: {
        name: order.receiverName,
        phone: order.receiverPhone,
        address: order.receiverAddress,
      },

      note: order.note,

      items: order.items.map((item) => this.toItem(item)),

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toItem(item: OrderItem) {
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
      productName: item.productName,
      productImage: item.productImage,
      selectedAttributes: item.selectedAttributes,
    };
  }

  static toList(order: OrderWithItems) {
    return {
      id: order.id,
      status: order.status,
      statusLabel: ORDER_STATUS_LABEL[order.status],

      totalPrice: order.totalPrice,

      itemCount: order.items.length,

      createdAt: order.createdAt,
    };
  }
}
