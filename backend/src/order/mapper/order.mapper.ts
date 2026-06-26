import { Order, OrderItem, Payment } from '@prisma/client';
import { ORDER_STATUS_LABEL } from './order-status.mapper';

type OrderWithItems = Order & {
  items: OrderItem[];
};

type OrderDetailEntity = OrderWithItems & {
  payment: Payment | null;
};

export class OrderMapper {
  static toDetail(order: OrderDetailEntity) {
    return {
      id: order.id,
      status: order.status,
      statusLabel: ORDER_STATUS_LABEL[order.status],

      payment: order.payment
        ? {
            method: order.payment.method,
            status: order.payment.status,
          }
        : null,

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
      slug: item.productSlug,
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

      thumbnail: order.items[0]?.productImage ?? null,

      createdAt: order.createdAt,
    };
  }
}
