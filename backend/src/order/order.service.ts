import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  User,
} from '@prisma/client';
import { UserService } from '@user/user.service';
import { CreateOrderItemDto } from './dtos/create-order-item.input';
import { NotificationsGateway } from '@notification/notification.gateway';
import { ORDER_STATUS_LABEL } from './mapper/order-status.mapper';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { GetOrdersQueryDto } from './dtos/get-orders.dto';
import { OrderMapper } from './mapper/order.mapper';
import { VoucherService } from '@voucher/voucher.service';
import { DecimalUtil } from '@common/utils/decimal';
import {
  OrderItemData,
  NormalizedItem,
  CreateOrderContext,
  Receiver,
} from '@common/types/order.type';
import { PaymentService } from '@payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private voucherService: VoucherService,
    private paymentService: PaymentService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /* case create order */
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
      voucherCode,
      voucherType,
      voucherValue,
      note,
    } = ctx;

    const order = await tx.order.create({
      data: {
        userId,
        subtotal,
        discountAmount,
        totalPrice,

        // Voucher snapshot
        voucherCode,
        voucherType,
        voucherValue,

        // Receiver snapshot
        receiverName: receiver.receiverName,
        receiverPhone: receiver.receiverPhone,
        receiverAddress: receiver.receiverAddress,

        // Metadata
        note: note || null,

        // Relation
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

  private async applyAndConsumeVoucher(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateOrderDto,
    orderItemsData: OrderItemData[],
  ) {
    if (!dto.voucherCode) {
      return {
        voucherResult: null,
        discountAmount: new Prisma.Decimal(0),
      };
    }

    const voucherResult = await this.voucherService.applyVoucher(userId, {
      voucherCode: dto.voucherCode,
      items: orderItemsData.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });

    const discountAmount = new Prisma.Decimal(voucherResult.discount);

    const voucher = await tx.voucher.findUnique({
      where: { id: voucherResult.voucherId },
      include: {
        userVouchers: {
          where: { userId },
        },
      },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher không tồn tại');
    }

    const userVoucher = voucher.userVouchers[0];

    // update voucher
    const voucherUpdateResult = await tx.voucher.updateMany({
      where: {
        id: voucher.id,
        ...(voucher.usageLimit != null && {
          usedCount: { lt: voucher.usageLimit },
        }),
      },
      data: {
        usedCount: { increment: 1 },
      },
    });

    if (voucherUpdateResult.count === 0) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    // update user voucher
    const userVoucherUpdateResult = await tx.userVoucher.updateMany({
      where: {
        userId,
        voucherId: voucher.id,
        ...(userVoucher?.remainingUsage != null && {
          remainingUsage: { gt: 0 },
        }),
      },
      data: {
        usedCount: { increment: 1 },
        ...(userVoucher?.remainingUsage != null && {
          remainingUsage: { decrement: 1 },
        }),
      },
    });

    if (userVoucherUpdateResult.count === 0) {
      throw new BadRequestException('Bạn đã dùng hết voucher này');
    }

    return { voucherResult, discountAmount };
  }

  private async processOrderTransaction(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateOrderDto,
    receiver: Receiver,
  ) {
    const normalizedItems = this.normalizeItems(dto.items);

    const { orderItemsData, subtotal } = await this.buildOrderItems(
      tx,
      normalizedItems,
    );

    const { voucherResult, discountAmount } = await this.applyAndConsumeVoucher(
      tx,
      userId,
      dto,
      orderItemsData,
    );

    const totalPrice = DecimalUtil.sub(subtotal, discountAmount);

    await this.updateStock(tx, normalizedItems);

    return this.createOrderRecord(tx, {
      userId,
      receiver,
      orderItemsData,
      subtotal,
      discountAmount,
      totalPrice,
      voucherCode: voucherResult?.voucherCode ?? null,
      voucherType: voucherResult?.type ?? null,
      voucherValue: voucherResult
        ? new Prisma.Decimal(voucherResult.value ?? 0)
        : null,
      note: dto.note,
    });
  }

  private async handlePayment(
    userId: string,
    orderId: string,
    method: PaymentMethod,
    ipAddr: string,
  ) {
    if (method === PaymentMethod.VNPAY) {
      const { paymentUrl, paymentId } =
        await this.paymentService.createVnpayPayment(userId, orderId, ipAddr);

      return {
        method: PaymentMethod.VNPAY,
        paymentId,
        paymentUrl,
      };
    }

    const { paymentId } = await this.paymentService.createCodPayment(
      userId,
      orderId,
    );

    return {
      method: PaymentMethod.COD,
      paymentId,
      status: PaymentStatus.PENDING,
    };
  }

  async createOrder(userId: string, dto: CreateOrderDto, ipAddr: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }

    const receiver = this.resolveReceiver(dto, user);
    this.validateInput(dto, receiver);

    const order = await this.prisma.$transaction((tx) =>
      this.processOrderTransaction(tx, userId, dto, receiver),
    );

    //PAYMENT
    const payment = await this.handlePayment(
      userId,
      order.id,
      dto.paymentMethod,
      ipAddr,
    );

    return {
      order,
      payment,
    };
  }

  /* case update status order */
  private validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    PROCESSING: [OrderStatus.READY_TO_SHIP, OrderStatus.CANCELLED],
    READY_TO_SHIP: [OrderStatus.SHIPPING],
    SHIPPING: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: [],
  };

  private async restoreStock(
    tx: Prisma.TransactionClient,
    items: { variantId: string; quantity: number }[],
  ) {
    for (const item of items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true, payment: true },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }

      const allowedNext = this.validTransitions[order.status] ?? [];
      if (!allowedNext.includes(newStatus)) {
        throw new BadRequestException(
          `Không thể chuyển trạng thái từ ${order.status} sang ${newStatus}`,
        );
      }

      const isVNPay = order.payment?.method === PaymentMethod.VNPAY;
      const isPaymentSuccess = order.payment?.status === PaymentStatus.SUCCESS;

      if (!order.payment) {
        throw new BadRequestException('Đơn hàng chưa có thanh toán');
      }

      if (isVNPay && !isPaymentSuccess && newStatus !== OrderStatus.CANCELLED) {
        throw new BadRequestException(
          'Đơn VNPay chỉ được cập nhật khi thanh toán SUCCESS hoặc CANCELLED',
        );
      }

      const updatedOrder = await tx.order.update({
        where: {
          id: orderId,
          status: order.status,
        },
        data: {
          status: newStatus,
        },
      });

      // Sau khi update order thành công
      if (
        updatedOrder.status === OrderStatus.DELIVERED &&
        order.payment?.method === PaymentMethod.COD &&
        order.payment.status === PaymentStatus.PENDING
      ) {
        await tx.payment.updateMany({
          where: {
            orderId: order.id,
            status: PaymentStatus.PENDING,
          },
          data: {
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
          },
        });
      }

      //Restore stock
      const wasCancelled = order.status !== OrderStatus.CANCELLED;
      const isNowCancelled = newStatus === OrderStatus.CANCELLED;
      if (wasCancelled && isNowCancelled) {
        await this.restoreStock(tx, order.items);

        await tx.payment.updateMany({
          where: {
            orderId: order.id,
            status: PaymentStatus.PENDING,
          },
          data: {
            status: PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
          },
        });
      }

      const label = ORDER_STATUS_LABEL[newStatus];

      await tx.notification.create({
        data: {
          userId: updatedOrder!.userId,
          title: 'Cập nhật đơn hàng',
          message: `Đơn hàng ${updatedOrder!.id} đã chuyển sang ${label}`,
          orderId: updatedOrder!.id,
        },
      });

      return updatedOrder!;
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

  /* case cancel order */
  async cancelOrder(userId: string, orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId },
        include: { payment: true },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng');
      }

      if (order.status === OrderStatus.CANCELLED) {
        return { success: true, message: 'Đơn hàng đã bị hủy trước đó' };
      }

      if (order.payment?.status === PaymentStatus.SUCCESS) {
        throw new BadRequestException(
          'Không thể huỷ đơn đã thanh toán thành công',
        );
      }

      const allowedNext = this.validTransitions[order.status] ?? [];
      if (!allowedNext.includes(OrderStatus.CANCELLED)) {
        throw new BadRequestException(
          `Không thể huỷ đơn ở trạng thái ${order.status}`,
        );
      }

      //Cancel payment
      if (order.payment) {
        await this.paymentService.cancelPayment(tx, userId, orderId);
      }

      //Update order status
      const updatedOrder = await tx.order.update({
        where: {
          id: orderId,
          status: order.status, // optimistic lock
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          items: true,
        },
      });

      //Restore stock
      await this.restoreStock(tx, updatedOrder.items);

      return {
        success: true,
        order: updatedOrder,
      };
    });
  }

  /* case list order and order item*/
  private buildStatusFilter(status?: string): Prisma.OrderWhereInput {
    if (!status) return {};

    // validate enum
    const isValid = Object.values(OrderStatus).includes(status as OrderStatus);
    if (!isValid) {
      throw new BadRequestException('Invalid order status');
    }

    return {
      status: status as OrderStatus,
    };
  }

  async getOrders(query: GetOrdersQueryDto, userId: string, role: string) {
    const { page, limit, skip } = getPagination({
      ...query,
      limit: 6,
    });

    const { status } = query;

    // filter theo status
    const statusFilter = this.buildStatusFilter(status);

    // filter theo role
    const roleFilter = role === 'ADMIN' ? {} : { userId };

    const where: Prisma.OrderWhereInput = {
      ...statusFilter,
      ...roleFilter,
    };

    // query song song
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    // map label
    const mapped = orders.map((order) => OrderMapper.toList(order));

    return buildPaginatedResponse(mapped, total, page, limit);
  }

  async getOrderDetail(orderId: string, userId: string, role: string) {
    const roleFilter = role === 'ADMIN' ? {} : { userId };

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        ...roleFilter,
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return OrderMapper.toDetail(order);
  }

  //support for rating
  async canUserRateProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        userId,
        status: OrderStatus.DELIVERED,
        items: {
          some: {
            productId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return !!order; //order ? true : false
  }
}
