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
    const {
      items,
      voucherCode,
      receiverName,
      receiverPhone,
      receiverAddress,
      note,
    } = dto;

    //FALLBACK: Nếu frontend không truyền receiver thì lấy từ thông tin User
    if (!dto.receiverName || !dto.receiverPhone || !dto.receiverAddress) {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Fallback receiver info từ User profile
      dto.receiverName = dto.receiverName || (user.fullname ?? 'Không có tên');
      dto.receiverPhone = dto.receiverPhone || (user.phone ?? '');
      dto.receiverAddress = dto.receiverAddress || (user.address ?? '');
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

      for (const item of normalizedItems) {
        const variant = variants.find((v) => v.id === item.variantId)!;
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
          throw new BadRequestException(
            'Mã voucher không hợp lệ hoặc đã bị vô hiệu hóa',
          );
        }

        const now = new Date();

        if (
          (appliedVoucher.startAt && appliedVoucher.startAt > now) ||
          (appliedVoucher.endAt && appliedVoucher.endAt < now)
        ) {
          throw new BadRequestException(
            'Voucher đã hết hạn hoặc chưa bắt đầu áp dụng',
          );
        }

        if (
          appliedVoucher.usageLimit &&
          appliedVoucher.usedCount >= appliedVoucher.usageLimit
        ) {
          throw new BadRequestException('Voucher đã hết lượt sử dụng');
        }

        if (
          appliedVoucher.minOrderValue &&
          subtotal.lt(appliedVoucher.minOrderValue)
        ) {
          throw new BadRequestException(
            `Giá trị đơn hàng tối thiểu để dùng voucher là ${appliedVoucher.minOrderValue}`,
          );
        }

        if (appliedVoucher.type === 'FIXED') {
          discountAmount = new Prisma.Decimal(appliedVoucher.value);
        } else {
          // PERCENT
          discountAmount = subtotal.mul(appliedVoucher.value).div(100);

          if (appliedVoucher.maxDiscount) {
            discountAmount = Prisma.Decimal.min(
              discountAmount,
              new Prisma.Decimal(appliedVoucher.maxDiscount),
            );
          }
        }

        // Đảm bảo discount không vượt quá subtotal
        if (discountAmount.gt(subtotal)) {
          discountAmount = subtotal;
        }
      }

      const totalPrice = subtotal.sub(discountAmount);

      // Check and update stock (Atomic)
      for (const item of normalizedItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, id: true },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm này không đủ tồn kho. Mã biến thể: ${item.variantId}, Tồn kho: ${variant?.stock || 0}, Yêu cầu: ${item.quantity}`,
          );
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
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
          receiverName,
          receiverPhone,
          receiverAddress,
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

      //Update voucher usage count
      if (appliedVoucher) {
        await tx.voucher.update({
          where: { id: appliedVoucher.id },
          data: {
            usedCount: { increment: 1 },
          },
        });
      }

      return order;
    });
  }
}
