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
  VoucherType,
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
  ApplyVoucherResult,
  NormalizedItem,
  CreateOrderContext,
} from './types/order.type';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private voucherService: VoucherService,
    private paymentService: PaymentService,
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

  // async createOrder(userId: string, dto: CreateOrderDto) {
  //   const user = await this.userService.findById(userId);
  //   if (!user) {
  //     throw new NotFoundException('Không tìm thấy người dùng!');
  //   }

  //   //Resolve receiver info
  //   const receiver = this.resolveReceiver(dto, user);

  //   //Validate input
  //   this.validateInput(dto, receiver);

  //   //Transaction
  //   return this.prisma.$transaction(async (tx) => {
  //     //Normalize items
  //     const normalizedItems = this.normalizeItems(dto.items);

  //     //Build order items + subtotal
  //     const { orderItemsData, subtotal } = await this.buildOrderItems(
  //       tx,
  //       normalizedItems,
  //     );

  //     //Apply voucher
  //     const { discountAmount, appliedVoucher } = await this.applyVoucher(
  //       tx,
  //       dto.voucherCode,
  //       subtotal,
  //     );

  //     //Tính tổng
  //     const totalPrice = subtotal.sub(discountAmount);

  //     //Update stock
  //     await this.updateStock(tx, normalizedItems);

  //     //Tạo order
  //     const ctx: CreateOrderContext = {
  //       userId,
  //       receiver,
  //       orderItemsData,
  //       subtotal,
  //       discountAmount,
  //       totalPrice,
  //       appliedVoucher,
  //       note: dto.note,
  //     };

  //     return this.createOrderRecord(tx, ctx);
  //   });
  // }

  // async createOrder(userId: string, dto: CreateOrderDto) {
  //   const user = await this.userService.findById(userId);

  //   if (!user) {
  //     throw new NotFoundException('Không tìm thấy người dùng!');
  //   }

  //   const receiver = this.resolveReceiver(dto, user);

  //   this.validateInput(dto, receiver);

  //   return this.prisma.$transaction(async (tx) => {
  //     // 1. Normalize items (merge quantity theo variant)
  //     const normalizedItems = this.normalizeItems(dto.items);

  //     const variantIds = normalizedItems.map((i) => i.variantId);

  //     // 2. Fetch variants + product snapshot data
  //     const variants = await tx.productVariant.findMany({
  //       where: { id: { in: variantIds } },
  //       include: { product: true },
  //     });

  //     if (variants.length !== variantIds.length) {
  //       throw new NotFoundException('Một hoặc nhiều biến thể không tồn tại');
  //     }

  //     const variantMap = new Map(variants.map((v) => [v.id, v]));

  //     let subtotal = new Prisma.Decimal(0);

  //     const orderItemsData: OrderItemData[] = [];

  //     for (const item of normalizedItems) {
  //       const variant = variantMap.get(item.variantId)!;
  //       const product = variant.product;

  //       if (!product.isActive) {
  //         throw new BadRequestException(
  //           `Sản phẩm "${product.name}" hiện ngừng kinh doanh`,
  //         );
  //       }

  //       const price = new Prisma.Decimal(
  //         product.discountPrice ?? product.price,
  //       );

  //       const lineTotal = DecimalUtil.mul(price, item.quantity);
  //       subtotal = DecimalUtil.add(subtotal, lineTotal);

  //       orderItemsData.push({
  //         productId: product.id,
  //         variantId: variant.id,
  //         quantity: item.quantity,
  //         price,
  //         productName: product.name,
  //         productImage: variant.images?.[0] ?? null,
  //         selectedAttributes: variant.attributes ?? undefined,
  //       });
  //     }

  //     // 3. Apply voucher (SOURCE OF TRUTH)
  //     let voucherResult: ApplyVoucherResult | null = null;

  //     if (dto.voucherCode) {
  //       voucherResult = await this.voucherService.applyVoucher(userId, {
  //         voucherCode: dto.voucherCode,
  //         items: dto.items,
  //       });
  //     }

  //     const discountAmount = new Prisma.Decimal(voucherResult?.discount ?? 0);

  //     const finalSubtotal = new Prisma.Decimal(
  //       voucherResult?.subtotal ?? subtotal,
  //     );

  //     const totalPrice = DecimalUtil.sub(finalSubtotal, discountAmount);

  //     // 4. Update stock (atomic check)
  //     for (const item of normalizedItems) {
  //       const updated = await tx.productVariant.updateMany({
  //         where: {
  //           id: item.variantId,
  //           stock: { gte: item.quantity },
  //         },
  //         data: {
  //           stock: { decrement: item.quantity },
  //         },
  //       });

  //       if (updated.count === 0) {
  //         throw new BadRequestException(
  //           `Không đủ tồn kho cho biến thể ${item.variantId}`,
  //         );
  //       }
  //     }

  //     // 5. Update voucher usage (IMPORTANT - prevent race condition)
  //     if (voucherResult) {
  //       await tx.voucher.update({
  //         where: { id: voucherResult.voucherId },
  //         data: {
  //           usedCount: { increment: 1 },
  //         },
  //       });

  //       await tx.userVoucher.updateMany({
  //         where: {
  //           userId,
  //           voucherId: voucherResult.voucherId,
  //         },
  //         data: {
  //           usedCount: { increment: 1 },
  //           remainingUsage: { decrement: 1 },
  //         },
  //       });
  //     }

  //     // 6. Create order
  //     const order = await tx.order.create({
  //       data: {
  //         userId,

  //         subtotal: finalSubtotal,
  //         discountAmount,
  //         totalPrice,

  //         voucherCode: voucherResult?.voucherCode ?? null,
  //         voucherType: voucherResult?.type ?? null,
  //         voucherValue: voucherResult?.value ?? null,

  //         receiverName: receiver.receiverName,
  //         receiverPhone: receiver.receiverPhone,
  //         receiverAddress: receiver.receiverAddress,

  //         note: dto.note ?? null,

  //         items: {
  //           create: orderItemsData,
  //         },
  //       },
  //       include: {
  //         items: true,
  //       },
  //     });

  //     return order;
  //   });
  // }

  async createOrder(userId: string, dto: CreateOrderDto, ipAddr: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }

    const receiver = this.resolveReceiver(dto, user);
    this.validateInput(dto, receiver);

    const order = await this.prisma.$transaction(async (tx) => {
      //Normalize items (merge quantity theo variant)
      const normalizedItems = this.normalizeItems(dto.items);

      //Build order items + tính subtotal gốc (không voucher)
      const { orderItemsData, subtotal } = await this.buildOrderItems(
        tx,
        normalizedItems,
      );

      //Apply voucher (nếu có)
      let voucherResult: ApplyVoucherResult | null = null;
      let discountAmount = new Prisma.Decimal(0);

      if (dto.voucherCode) {
        voucherResult = await this.voucherService.applyVoucher(userId, {
          voucherCode: dto.voucherCode,
          items: orderItemsData.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        });

        discountAmount = new Prisma.Decimal(voucherResult.discount);
      }

      const totalPrice = DecimalUtil.sub(subtotal, discountAmount);

      //Update stock
      await this.updateStock(tx, normalizedItems);

      //Update voucher usage (nếu có voucher)
      if (voucherResult) {
        await tx.voucher.update({
          where: { id: voucherResult.voucherId },
          data: {
            usedCount: { increment: 1 },
          },
        });

        await tx.userVoucher.updateMany({
          where: {
            userId,
            voucherId: voucherResult.voucherId,
          },
          data: {
            usedCount: { increment: 1 },
            ...(true && { remainingUsage: { decrement: 1 } }),
          },
        });
      }

      //Tạo order
      return await this.createOrderRecord(tx, {
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
    });

    //PAYMENT
    if (dto.paymentMethod === PaymentMethod.VNPAY) {
      const { paymentUrl, paymentId } =
        await this.paymentService.createVnpayPayment(userId, order.id, ipAddr);

      return {
        order,
        payment: {
          method: PaymentMethod.VNPAY,
          paymentId,
          paymentUrl,
        },
      };
    }

    return {
      order,
      payment: {
        method: PaymentMethod.COD,
        status: 'PENDING',
      },
    };
  }

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

      //Restore stock
      const wasCancelled = order.status !== OrderStatus.CANCELLED;
      const isNowCancelled = newStatus === OrderStatus.CANCELLED;
      if (wasCancelled && isNowCancelled) {
        await this.restoreStock(tx, order.items);
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
}
