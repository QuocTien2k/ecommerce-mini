import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, Prisma, User } from '@prisma/client';
import { UserService } from '@user/user.service';
import { CreateOrderItemDto } from './dtos/create-order-item.input';
import { NotificationsGateway } from '@notification/notification.gateway';
import { ORDER_STATUS_LABEL } from './mapper/order-status.mapper';

type OrderItemData = {
  productId: string;
  variantId: string;
  quantity: number;
  price: Prisma.Decimal;
  productName: string;
  productImage: string | null;
  selectedAttributes?: any;
};

type NormalizedItem = { variantId: string; quantity: number };

type CreateOrderContext = {
  userId: string;
  receiver: {
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
  };
  orderItemsData: OrderItemData[];
  subtotal: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  appliedVoucher: any; // có thể định Voucher type rõ hơn nếu muốn
  note?: string;
};

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  private normalizeItems(items: CreateOrderItemDto[]) {
    const quantityMap = new Map<string, number>();

    for (const item of items) {
      const currentQty = quantityMap.get(item.variantId) || 0;

      quantityMap.set(item.variantId, currentQty + item.quantity);
    }

    return Array.from(quantityMap.entries()).map(([variantId, quantity]) => ({
      variantId,
      quantity,
    }));
  }

  private async buildOrderItems(
    tx: Prisma.TransactionClient,
    normalizedItems: { variantId: string; quantity: number }[],
  ) {
    const variantIds = normalizedItems.map((i) => i.variantId);

    // Fetch variants + products
    const variants = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== variantIds.length) {
      throw new NotFoundException(
        'Một hoặc nhiều biến thể sản phẩm không tồn tại',
      );
    }

    const variantMap = new Map<string, (typeof variants)[number]>();
    for (const v of variants) variantMap.set(v.id, v);

    let subtotal = new Prisma.Decimal(0);
    const orderItemsData: OrderItemData[] = [];

    for (const item of normalizedItems) {
      const variant = variantMap.get(item.variantId)!;
      const product = variant.product;

      if (!product.isActive) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" hiện đang ngừng kinh doanh`,
        );
      }

      const price = product.discountPrice ?? product.price;
      const lineTotal = new Prisma.Decimal(price).mul(item.quantity);
      subtotal = subtotal.add(lineTotal);

      orderItemsData.push({
        productId: product.id,
        variantId: variant.id,
        quantity: item.quantity,
        price,
        productName: product.name,
        productImage: variant.images?.[0] ?? null,
        selectedAttributes: variant.attributes ?? undefined,
      });
    }

    return { orderItemsData, subtotal };
  }

  private async applyVoucher(
    tx: Prisma.TransactionClient,
    voucherCode: string | undefined,
    subtotal: Prisma.Decimal,
  ) {
    if (!voucherCode)
      return { discountAmount: new Prisma.Decimal(0), appliedVoucher: null };

    const appliedVoucher = await tx.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!appliedVoucher || !appliedVoucher.isActive) {
      throw new BadRequestException('Voucher không hợp lệ');
    }

    const now = new Date();
    if (
      (appliedVoucher.startAt && appliedVoucher.startAt > now) ||
      (appliedVoucher.endAt && appliedVoucher.endAt < now)
    ) {
      throw new BadRequestException('Voucher không khả dụng');
    }

    if (
      appliedVoucher.minOrderValue &&
      subtotal.lt(appliedVoucher.minOrderValue)
    ) {
      throw new BadRequestException('Không đủ giá trị đơn hàng');
    }

    const whereCondition = {
      id: appliedVoucher.id,
      isActive: true,
      ...(appliedVoucher.usageLimit
        ? { usedCount: { lt: appliedVoucher.usageLimit } } // nếu usageLimit có giá trị
        : {}), // nếu null → bỏ điều kiện
    };

    // Atomic consume
    const updated = await tx.voucher.updateMany({
      where: whereCondition,
      data: { usedCount: { increment: 1 } },
    });

    if (updated.count === 0) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    // Tính discount
    let discountAmount: Prisma.Decimal;
    if (appliedVoucher.type === 'FIXED') {
      discountAmount = new Prisma.Decimal(appliedVoucher.value);
    } else {
      discountAmount = subtotal.mul(appliedVoucher.value).div(100);
      if (appliedVoucher.maxDiscount) {
        discountAmount = Prisma.Decimal.min(
          discountAmount,
          new Prisma.Decimal(appliedVoucher.maxDiscount),
        );
      }
    }

    if (discountAmount.gt(subtotal)) discountAmount = subtotal;

    return { discountAmount, appliedVoucher };
  }

  private async updateStock(
    tx: Prisma.TransactionClient,
    normalizedItems: NormalizedItem[],
  ) {
    for (const item of normalizedItems) {
      const updated = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity }, // chỉ decrement nếu đủ stock
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count === 0) {
        throw new BadRequestException(
          `Không đủ tồn kho cho biến thể ${item.variantId}`,
        );
      }
    }
  }

  private async createOrderRecord(
    tx: Prisma.TransactionClient,
    ctx: CreateOrderContext,
  ) {
    const {
      userId,
      receiver,
      orderItemsData,
      subtotal,
      discountAmount,
      totalPrice,
      appliedVoucher,
      note,
    } = ctx;

    const order = await tx.order.create({
      data: {
        userId,
        subtotal,
        discountAmount,
        totalPrice,

        // Voucher snapshot
        voucherCode: appliedVoucher?.code || null,
        voucherType: appliedVoucher?.type || null,
        voucherValue: appliedVoucher?.value || null,

        // Receiver snapshot
        receiverName: receiver.receiverName,
        receiverPhone: receiver.receiverPhone,
        receiverAddress: receiver.receiverAddress,

        // Metadata
        note: note || null,

        // Relation: order items
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    return order;
  }

  private resolveReceiver(dto: CreateOrderDto, user: User) {
    return {
      receiverName: dto.receiverName ?? user.fullname ?? 'Không có tên',
      receiverPhone: dto.receiverPhone ?? user.phone ?? '',
      receiverAddress: dto.receiverAddress ?? user.address ?? '',
    };
  }

  private validateInput(
    dto: CreateOrderDto,
    receiver: { receiverPhone: string; receiverAddress: string },
  ) {
    if (!receiver.receiverPhone) {
      throw new BadRequestException('Số điện thoại nhận hàng là bắt buộc');
    }

    if (!receiver.receiverAddress) {
      throw new BadRequestException('Địa chỉ nhận hàng là bắt buộc');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }

    //Resolve receiver info
    const receiver = this.resolveReceiver(dto, user);

    //Validate input
    this.validateInput(dto, receiver);

    //Transaction
    return this.prisma.$transaction(async (tx) => {
      //Normalize items
      const normalizedItems = this.normalizeItems(dto.items);

      //Build order items + subtotal
      const { orderItemsData, subtotal } = await this.buildOrderItems(
        tx,
        normalizedItems,
      );

      //Apply voucher
      const { discountAmount, appliedVoucher } = await this.applyVoucher(
        tx,
        dto.voucherCode,
        subtotal,
      );

      //Tính tổng
      const totalPrice = subtotal.sub(discountAmount);

      //Update stock
      await this.updateStock(tx, normalizedItems);

      //Tạo order
      const ctx: CreateOrderContext = {
        userId,
        receiver,
        orderItemsData,
        subtotal,
        discountAmount,
        totalPrice,
        appliedVoucher,
        note: dto.note,
      };

      return this.createOrderRecord(tx, ctx);
    });
  }

  private validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['READY_TO_SHIP', 'CANCELLED'],
    READY_TO_SHIP: ['SHIPPING'],
    SHIPPING: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }

      if (!this.validTransitions[order.status].includes(newStatus)) {
        throw new BadRequestException(
          `Không thể chuyển từ ${order.status} sang ${newStatus}`,
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      const label = ORDER_STATUS_LABEL[newStatus];

      await tx.notification.create({
        data: {
          userId: updatedOrder.userId,
          title: 'Cập nhật đơn hàng',
          message: `Đơn hàng ${updatedOrder.id} đã chuyển sang ${label}`,
          orderId: updatedOrder.id,
        },
      });

      return updatedOrder;
    });

    //Emit sau khi transaction thành công
    this.notificationsGateway.sendToUser(result.userId, {
      type: 'ORDER_STATUS_UPDATED',
      orderId: result.id,
      status: result.status,
      statusLabel: ORDER_STATUS_LABEL[result.status],
      message: `Đơn hàng ${result.id} đã chuyển sang ${ORDER_STATUS_LABEL[result.status]}`,
    });

    return result;
  }
}
