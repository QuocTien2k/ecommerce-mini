import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserService } from '@user/user.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const { items, voucherCode, note } = dto;

    //FALLBACK: Nếu frontend không truyền receiver thì lấy từ thông tin User
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Resolve receiver snapshot (single source)
    const resolvedReceiverName =
      dto.receiverName ?? user.fullname ?? 'Không có tên';

    const resolvedReceiverPhone = dto.receiverPhone ?? user.phone ?? '';

    const resolvedReceiverAddress = dto.receiverAddress ?? user.address ?? '';

    if (!resolvedReceiverPhone) {
      throw new BadRequestException('Số điện thoại nhận hàng là bắt buộc');
    }

    if (!resolvedReceiverAddress) {
      throw new BadRequestException('Địa chỉ nhận hàng là bắt buộc');
    }

    if (!items || items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    return this.prisma.$transaction(async (tx) => {
      // Normalize items (merge duplicate variant)
      const quantityMap = new Map<string, number>();

      for (const item of items) {
        quantityMap.set(
          item.variantId,
          (quantityMap.get(item.variantId) || 0) + item.quantity,
        );
      }

      const normalizedItems = Array.from(quantityMap.entries()).map(
        ([variantId, quantity]) => ({
          variantId,
          quantity,
        }),
      );

      const variantIds = normalizedItems.map((i) => i.variantId);

      //Fetch variants + products
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: {
          product: true,
        },
      });

      if (variants.length !== variantIds.length) {
        throw new NotFoundException(
          'Một hoặc nhiều biến thể sản phẩm không tồn tại',
        );
      }

      //Build order items data + calculate subtotal
      let subtotal = new Prisma.Decimal(0);
      const orderItemsData: any[] = [];

      const variantMap = new Map<string, (typeof variants)[number]>();

      for (const v of variants) {
        variantMap.set(v.id, v);
      }

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
          productImage: variant.images?.[0] || null,
          selectedAttributes: variant.attributes ?? undefined,
        });
      }

      //Handle Voucher
      let discountAmount = new Prisma.Decimal(0);
      let appliedVoucher: any = null;

      if (voucherCode) {
        appliedVoucher = await tx.voucher.findUnique({
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

        // 👉 ATOMIC CONSUME
        const updated = await tx.voucher.updateMany({
          where: {
            id: appliedVoucher.id,
            isActive: true,
            OR: [
              { usageLimit: null }, // không giới hạn
              { usedCount: { lt: appliedVoucher.usageLimit } },
            ],
          },
          data: {
            usedCount: { increment: 1 },
          },
        });

        if (updated.count === 0) {
          throw new BadRequestException('Voucher đã hết lượt sử dụng');
        }

        // thành công => tính discount
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

        if (discountAmount.gt(subtotal)) {
          discountAmount = subtotal;
        }
      }

      const totalPrice = subtotal.sub(discountAmount);

      // Check and update stock (Atomic)
      for (const item of normalizedItems) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: {
              gte: item.quantity, // điều kiện đủ stock
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new BadRequestException(
            `Không đủ tồn kho cho biến thể ${item.variantId}`,
          );
        }
      }

      //Create Order + OrderItems
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
          receiverName: resolvedReceiverName,
          receiverPhone: resolvedReceiverPhone,
          receiverAddress: resolvedReceiverAddress,
          // Metadata
          note: note || null,
          // Relation
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }
}
