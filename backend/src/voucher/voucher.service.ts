import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import {
  Prisma,
  UserVoucher,
  Voucher,
  VoucherScope,
  VoucherType,
} from '@prisma/client';
import { AssignVoucherDto } from './dtos/assign-voucher.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { GetMyVouchersDto } from './dtos/get-my-voucher.dto';
import { GetVouchersAdminDto } from './dtos/get-voucher-admin.dto';
import { VoucherStatus } from './enum/voucher-status.enum';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';
import { ApplyVoucherDto } from './dtos/apply-voucher.dto';
import { ApplyVoucherResult } from '@common/types/voucher.type';
import { NotificationsGateway } from '@notification/notification.gateway';
import { VoucherDetailAdminResponseDto } from './dtos/voucher-detail.dto';
import { NotificationResponseDto } from '@notification/dtos/notification.dto';
import { AvailableVoucherDto } from './dtos/available-voucher.dto';
import { CategoryService } from '@category/category.service';

@Injectable()
export class VoucherService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
    private categoryService: CategoryService,
  ) {}

  private getAvailableVoucherWhere(now: Date): Prisma.VoucherWhereInput {
    return {
      isDeleted: false,
      isActive: true,
      AND: [
        {
          OR: [{ startAt: null }, { startAt: { lte: now } }],
        },
        {
          OR: [{ endAt: null }, { endAt: { gte: now } }],
        },
      ],
    };
  }

  private validateVoucherState(
    voucher: Voucher & {
      userVouchers: UserVoucher[];
    },
  ) {
    const now = new Date();

    if (voucher.isDeleted || !voucher.isActive) {
      throw new BadRequestException('Voucher không hợp lệ');
    }

    if (voucher.startAt && voucher.startAt > now) {
      throw new BadRequestException('Voucher chưa bắt đầu');
    }

    if (voucher.endAt && voucher.endAt < now) {
      throw new BadRequestException('Voucher đã hết hạn');
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    const userVoucher = voucher.userVouchers[0];

    if (voucher.scope === VoucherScope.ORDER) {
      if (!userVoucher) {
        throw new BadRequestException('Bạn không có quyền sử dụng voucher này');
      }

      const remaining =
        userVoucher.remainingUsage ??
        (userVoucher.usagePerUser != null
          ? userVoucher.usagePerUser - userVoucher.usedCount
          : null);

      if (remaining != null && remaining <= 0) {
        throw new BadRequestException('Bạn đã dùng hết voucher này');
      }
    }

    return userVoucher ?? null;
  }

  /* Case create */
  private validate(dto: CreateVoucherDto) {
    // type vs value
    if (dto.type === VoucherType.PERCENT && dto.value > 100) {
      throw new BadRequestException(
        'Giá trị phần trăm không được vượt quá 100',
      );
    }

    // type vs maxDiscount
    if (dto.type === VoucherType.PERCENT && dto.maxDiscount == null) {
      throw new BadRequestException('Voucher % cần maxDiscount');
    }

    if (dto.type === VoucherType.FIXED && dto.maxDiscount) {
      throw new BadRequestException('Voucher FIXED không dùng maxDiscount');
    }

    // date logic
    if (dto.startAt && dto.endAt) {
      if (new Date(dto.startAt) > new Date(dto.endAt)) {
        throw new BadRequestException(
          'Thời gian bắt đầu phải trước thời gian kết thúc',
        );
      }
    }

    const now = new Date();
    if (dto.startAt && new Date(dto.startAt).getTime() < now.getTime()) {
      throw new BadRequestException('startAt không được ở quá khứ');
    }

    if (dto.endAt && new Date(dto.endAt).getTime() < now.getTime()) {
      throw new BadRequestException('endAt không hợp lệ (đã ở quá khứ)');
    }

    // scope validation
    if (dto.scope === VoucherScope.PRODUCT) {
      if (!dto.productIds || dto.productIds.length === 0) {
        throw new BadRequestException(
          'Voucher phạm vi PRODUCT cần có productIds',
        );
      }
    }

    if (dto.scope === VoucherScope.CATEGORY) {
      if (!dto.categoryIds || dto.categoryIds.length === 0) {
        throw new BadRequestException(
          'Voucher phạm vi CATEGORY cần có categoryIds',
        );
      }
    }

    // chống rác khi scope = ORDER
    if (dto.scope === VoucherScope.ORDER) {
      if (dto.productIds?.length || dto.categoryIds?.length) {
        throw new BadRequestException(
          'Voucher ORDER không được có productIds hoặc categoryIds',
        );
      }
    }
  }

  private buildCreateData(dto: CreateVoucherDto): Prisma.VoucherCreateInput {
    return {
      code: dto.code,
      type: dto.type,
      value: dto.value,
      maxDiscount: dto.maxDiscount,
      minOrderValue: dto.minOrderValue,
      usageLimit: dto.usageLimit,
      scope: dto.scope,
      isActive: dto.isActive ?? true,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),

      products:
        dto.scope === VoucherScope.PRODUCT && dto.productIds
          ? {
              connect: dto.productIds.map((id) => ({ id })),
            }
          : undefined,

      categories:
        dto.scope === VoucherScope.CATEGORY && dto.categoryIds
          ? {
              connect: dto.categoryIds.map((id) => ({ id })),
            }
          : undefined,
    };
  }

  async createVoucher(dto: CreateVoucherDto) {
    console.log('CREATE DTO:', dto);
    this.validate(dto);

    try {
      return await this.prisma.voucher.create({
        data: this.buildCreateData(dto),
      });
    } catch (error) {
      // Prisma unique constraint
      if (error.code === 'P2002') {
        throw new BadRequestException('Voucher code đã tồn tại');
      }

      throw error;
    }
  }

  /* Gửi voucher cho user */
  async assignVoucherToUsers(voucherId: string, dto: AssignVoucherDto) {
    const { userIds, usagePerUser } = dto;

    const result = await this.prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.findUnique({
        where: { id: voucherId },
      });

      if (!voucher) {
        throw new NotFoundException('Voucher không tồn tại');
      }

      if (!voucher.isActive) {
        throw new BadRequestException('Voucher chưa active');
      }

      if (voucher.isDeleted) {
        throw new BadRequestException('Voucher đã bị xoá');
      }

      const now = new Date();

      if (voucher.startAt && voucher.startAt > now) {
        throw new BadRequestException('Voucher chưa đến thời gian sử dụng');
      }

      if (voucher.endAt && voucher.endAt < now) {
        throw new BadRequestException('Voucher đã hết hạn');
      }

      const usage = usagePerUser ?? 1;

      // lấy các user đã được cấp voucher trước đó
      const existedUserVouchers = await tx.userVoucher.findMany({
        where: {
          voucherId,
          userId: {
            in: userIds,
          },
        },
        select: {
          userId: true,
        },
      });

      const existedUserIds = new Set(
        existedUserVouchers.map((item) => item.userId),
      );

      const newUserIds = userIds.filter((id) => !existedUserIds.has(id));

      if (newUserIds.length === 0) {
        throw new BadRequestException(
          'Tất cả người dùng đã được cấp voucher này',
        );
      }

      // kiểm tra quota còn lại
      if (voucher.usageLimit != null) {
        const allocatedUsage = await tx.userVoucher.aggregate({
          where: {
            voucherId,
          },
          _sum: {
            usagePerUser: true,
          },
        });

        const allocated = allocatedUsage._sum.usagePerUser ?? 0;

        const requiredUsage = usage * newUserIds.length;

        const remaining = voucher.usageLimit - allocated;

        if (requiredUsage > remaining) {
          throw new BadRequestException(
            `Không đủ lượt cấp phát. Còn ${remaining} lượt sử dụng`,
          );
        }
      }

      const data: Prisma.UserVoucherCreateManyInput[] = newUserIds.map(
        (userId) => ({
          userId,
          voucherId,
          usagePerUser: usage,
          usedCount: 0,
          remainingUsage: usage,
        }),
      );

      const inserted = await tx.userVoucher.createMany({
        data,
      });

      const notifications = newUserIds.map((userId) => ({
        userId,
        title: 'Bạn vừa nhận voucher mới',
        message: `Voucher ${voucher.code} đã được cấp cho bạn`,
        path: '/my-vouchers',
        voucherId,
      }));

      const createdNotifications = await Promise.all(
        notifications.map((notification) =>
          tx.notification.create({
            data: notification,
          }),
        ),
      );

      return {
        assigned: inserted.count,
        voucher,
        notifications: createdNotifications,
      };
    });

    result.notifications.forEach((notification) => {
      const payload: NotificationResponseDto = {
        id: notification.id,
        type: 'VOUCHER_ASSIGNED',
        title: notification.title,
        message: notification.message,
        path: '/my-vouchers',
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      };

      this.notificationsGateway.sendToUser(notification.userId, payload);
    });

    return result;
  }

  /* Case get list vouchers*/
  async getMyVouchers(userId: string, query: GetMyVouchersDto) {
    const { page, limit, skip } = getPagination(query);
    const now = new Date();

    const where: Prisma.UserVoucherWhereInput = {
      userId,

      voucher: this.getAvailableVoucherWhere(now),

      // còn lượt dùng
      OR: [{ remainingUsage: null }, { remainingUsage: { gt: 0 } }],
    };

    const [data, total] = await Promise.all([
      this.prisma.userVoucher.findMany({
        where,
        include: {
          voucher: true,
        },
        orderBy: {
          assignedAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.userVoucher.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  private buildAdminWhere(dto: GetVouchersAdminDto): Prisma.VoucherWhereInput {
    const { search, type, scope, isActive, status } = dto;
    const now = new Date();

    let statusCondition: Prisma.VoucherWhereInput = {};

    if (status === VoucherStatus.UPCOMING) {
      statusCondition = {
        startAt: { gt: now },
      };
    }

    if (status === VoucherStatus.ACTIVE) {
      statusCondition = {
        isActive: true,
        AND: [
          {
            OR: [{ startAt: null }, { startAt: { lte: now } }],
          },
          {
            OR: [{ endAt: null }, { endAt: { gte: now } }],
          },
        ],
      };
    }

    if (status === VoucherStatus.EXPIRED) {
      statusCondition = {
        OR: [{ endAt: { lt: now } }, { isActive: false }],
      };
    }

    return {
      ...(search && {
        code: {
          contains: search,
          mode: 'insensitive',
        },
      }),

      ...(type && { type }),
      ...(scope && { scope }),

      ...(isActive !== undefined && { isActive }),

      ...statusCondition,
    };
  }

  async getVouchersAdmin(query: GetVouchersAdminDto) {
    const { page, limit, skip } = getPagination({
      ...query,
      limit: query.limit ?? 8,
    });

    const where = this.buildAdminWhere(query);

    const finalWhere = {
      ...where,
    };

    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where: finalWhere,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.voucher.count({ where: finalWhere }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async getVoucherDetailForAdmin(
    voucherId: string,
  ): Promise<VoucherDetailAdminResponseDto> {
    if (!voucherId?.trim()) {
      throw new BadRequestException('Voucher ID không được để trống');
    }

    const voucher = await this.prisma.voucher.findFirst({
      where: {
        id: voucherId,
        isDeleted: false,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!voucher) {
      throw new NotFoundException(
        `Không tìm thấy voucher với ID: ${voucherId}`,
      );
    }

    return {
      id: voucher.id,
      code: voucher.code,
      type: voucher.type,
      value: Number(voucher.value),
      maxDiscount: voucher.maxDiscount
        ? Number(voucher.maxDiscount)
        : undefined,
      minOrderValue: voucher.minOrderValue
        ? Number(voucher.minOrderValue)
        : undefined,
      usageLimit: voucher.usageLimit ?? 0,
      usedCount: voucher.usedCount,
      scope: voucher.scope,
      isActive: voucher.isActive,
      startAt: voucher.startAt,
      endAt: voucher.endAt,
      createdAt: voucher.createdAt,
      updatedAt: voucher.updatedAt,

      // IDs
      productIds: voucher.products.map((p) => p.id),
      categoryIds: voucher.categories.map((c) => c.id),

      // Thông tin hiển thị
      products: voucher.products.map((p) => ({
        id: p.id,
        name: p.name,
      })),
      categories: voucher.categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
    };
  }

  /* Case update*/
  private validateUpdate(dto: UpdateVoucherDto, current: Voucher) {
    const now = new Date();

    if (dto.startAt && dto.endAt) {
      if (new Date(dto.startAt) > new Date(dto.endAt)) {
        throw new BadRequestException('startAt phải trước endAt');
      }
    }

    if (dto.startAt && new Date(dto.startAt) < now) {
      throw new BadRequestException('startAt không được ở quá khứ');
    }

    if (dto.endAt && new Date(dto.endAt) < now) {
      throw new BadRequestException('endAt không hợp lệ');
    }

    // usageLimit: không cho giảm dưới usedCount
    if (dto.usageLimit != null) {
      if (dto.usageLimit < current.usedCount) {
        throw new BadRequestException(
          'usageLimit không được nhỏ hơn usedCount',
        );
      }
    }
  }

  async updateVoucher(voucherId: string, dto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: voucherId },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    if (voucher.isDeleted) {
      throw new BadRequestException('Voucher đã bị xoá');
    }

    // check assign
    const assigned = await this.prisma.userVoucher.findFirst({
      where: { voucherId: voucherId },
      select: { id: true },
    });

    if (assigned) {
      const forbidden = [
        'code',
        'type',
        'value',
        'scope',
        'productIds',
        'categoryIds',
      ];

      const hasForbidden = forbidden.some((f) => dto[f] !== undefined);

      if (hasForbidden) {
        throw new BadRequestException(
          'Voucher đã được sử dụng, chỉ được cập nhật trạng thái hoặc thông tin vận hành',
        );
      }
    }

    this.validateUpdate(dto, voucher);

    return this.prisma.voucher.update({
      where: { id: voucherId },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
    });
  }

  /* Case soft delete */
  async softDeleteVoucher(voucherId: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: voucherId },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    // đã assign → không cho xoá
    const assigned = await this.prisma.userVoucher.findFirst({
      where: { voucherId },
      select: { id: true },
    });

    if (assigned) {
      throw new BadRequestException(
        'Không thể xoá voucher vì đã được cấp cho người dùng',
      );
    }

    // đã bị xoá trước đó
    if (voucher.isDeleted) {
      throw new BadRequestException('Voucher đã bị xoá trước đó');
    }

    return this.prisma.voucher.update({
      where: { id: voucherId },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  /* Case get voucher flow cart */
  private async resolveUserVouchers(userId: string) {
    const now = new Date();

    /* GLOBAL vouchers (không cần UserVoucher) */
    const globalVouchers = await this.prisma.voucher.findMany({
      where: this.getAvailableVoucherWhere(now),
      include: {
        products: {
          select: {
            id: true,
          },
        },
        categories: {
          select: {
            id: true,
          },
        },
        userVouchers: {
          where: {
            userId,
          },
        },
      },
    });

    // console.log('=== GLOBAL VOUCHERS ===');
    // console.log(globalVouchers.map((v) => v.code));

    /* ASSIGNED vouchers (UserVoucher) */
    const assignedUserVouchers = await this.prisma.userVoucher.findMany({
      where: {
        userId,
        OR: [{ remainingUsage: null }, { remainingUsage: { gt: 0 } }],
        voucher: this.getAvailableVoucherWhere(now),
      },
      include: {
        voucher: {
          include: {
            products: {
              select: {
                id: true,
              },
            },
            categories: {
              select: {
                id: true,
              },
            },
            userVouchers: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    // console.log('=== ASSIGNED VOUCHERS ===');
    // console.log(assignedUserVouchers.map((v) => v.voucher.code));

    /* Normalize về cùng format */
    const merged = [
      ...globalVouchers.map((v) => ({ voucher: v, userVoucher: null })),
      ...assignedUserVouchers.map((uv) => ({
        voucher: uv.voucher,
        userVoucher: uv,
      })),
    ];

    const unique = new Map<string, any>();

    for (const item of merged) {
      unique.set(item.voucher.id, item);
    }

    return Array.from(unique.values());
  }

  private async previewVoucher(voucher: Voucher, subtotal: number) {
    const appliedSubtotal = subtotal;

    const discount = this.calculateVoucherDiscount(voucher, appliedSubtotal);

    return this.mapToApplyVoucherResult(
      {
        voucher,
        subtotal,
        appliedSubtotal,
        remaining: null,
      },
      discount,
    );
  }

  async getAvailableVouchers(
    userId: string,
    subtotal: number,
  ): Promise<AvailableVoucherDto[]> {
    const vouchers = await this.resolveUserVouchers(userId);

    const availableVouchers: AvailableVoucherDto[] = [];

    for (const { voucher } of vouchers) {
      try {
        this.validateVoucherState(voucher);

        const result = await this.previewVoucher(voucher, subtotal);

        availableVouchers.push({
          id: voucher.id,
          code: voucher.code,
          type: voucher.type,
          value: Number(voucher.value),
          maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
          minOrderValue: voucher.minOrderValue
            ? Number(voucher.minOrderValue)
            : null,
          scope: voucher.scope,
          endAt: voucher.endAt,
          subtotal: result.subtotal,
          appliedSubtotal: result.appliedSubtotal,
          discount: result.discount,
          finalTotal: result.finalTotal,
          remainingUsage: result.remainingUsage ?? null,
        });
      } catch {
        continue;
      }
    }

    return availableVouchers;
  }

  /*Case apply*/
  private async validateVoucherApplication(
    userId: string,
    dto: ApplyVoucherDto,
  ) {
    const { voucherCode, items } = dto;

    const voucher = await this.prisma.voucher.findUnique({
      where: { code: voucherCode },
      include: {
        products: { select: { id: true } },
        categories: { select: { id: true } },
        userVouchers: {
          where: { userId },
        },
      },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher không tồn tại');
    }

    const userVoucher = this.validateVoucherState(voucher);

    let remaining: number | null = null;

    if (userVoucher) {
      remaining =
        userVoucher.remainingUsage ??
        (userVoucher.usagePerUser != null
          ? userVoucher.usagePerUser - userVoucher.usedCount
          : null);
    }

    const productIds = items.map((i) => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        discountPrice: true,
        categoryId: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const enrichedItems = items.map((i) => {
      const product = productMap.get(i.productId);

      if (!product) {
        throw new BadRequestException('Product không tồn tại');
      }

      const price = Number(product.discountPrice ?? product.price);

      return {
        ...i,
        price,
        categoryId: product.categoryId,
      };
    });

    const subtotal = enrichedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
      throw new BadRequestException('Không đạt giá trị đơn tối thiểu');
    }

    let applicableItems = enrichedItems;

    if (voucher.scope === VoucherScope.PRODUCT) {
      const allowed = new Set(voucher.products.map((p) => p.id));
      applicableItems = enrichedItems.filter((i) => allowed.has(i.productId));
    }

    if (voucher.scope === VoucherScope.CATEGORY) {
      const allowed = new Set(voucher.categories.map((c) => c.id));

      const enrichedWithAncestors = await Promise.all(
        enrichedItems.map(async (i) => {
          const ancestorIds = await this.categoryService.getAncestorIds(
            i.categoryId,
          );
          // console.log('=== VOUCHER CATEGORY ===');
          // console.log(voucher.categories.map((c) => c.id));

          // console.log('=== PRODUCT ROOT CHAIN ===');
          // console.log({
          //   productId: i.productId,
          //   ancestorIds,
          // });

          return {
            ...i,
            ancestorIds,
          };
        }),
      );

      applicableItems = enrichedWithAncestors.filter((i) =>
        i.ancestorIds.some((id) => allowed.has(id)),
      );
    }

    const appliedSubtotal = applicableItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    if (appliedSubtotal <= 0) {
      throw new BadRequestException(
        'Voucher không áp dụng được cho đơn hàng này',
      );
    }

    return {
      voucher,
      userVoucher,
      subtotal,
      appliedSubtotal,
      remaining,
    };
  }

  private calculateVoucherDiscount(
    voucher: Voucher,
    appliedSubtotal: number,
  ): number {
    let discount = 0;

    if (voucher.type === VoucherType.PERCENT) {
      discount = appliedSubtotal * (Number(voucher.value) / 100);

      if (voucher.maxDiscount) {
        discount = Math.min(discount, Number(voucher.maxDiscount));
      }
    }

    if (voucher.type === VoucherType.FIXED) {
      discount = Number(voucher.value);
      discount = Math.min(discount, appliedSubtotal);
    }

    return discount;
  }

  private mapToApplyVoucherResult(
    ctx: {
      voucher: Voucher;
      subtotal: number;
      appliedSubtotal: number;
      remaining: number | null;
    },
    discount: number,
  ): ApplyVoucherResult {
    const finalTotal = ctx.subtotal - discount;

    return {
      subtotal: ctx.subtotal,
      discount,
      finalTotal,
      appliedSubtotal: ctx.appliedSubtotal,
      voucherId: ctx.voucher.id,
      voucherCode: ctx.voucher.code,
      type: ctx.voucher.type,
      value: Number(ctx.voucher.value),
      usageLimit: ctx.voucher.usageLimit ?? null,
      remainingUsage: ctx.remaining ?? null,
    };
  }

  async applyVoucher(
    userId: string,
    dto: ApplyVoucherDto,
  ): Promise<ApplyVoucherResult> {
    const ctx = await this.validateVoucherApplication(userId, dto);

    const discount = this.calculateVoucherDiscount(
      ctx.voucher,
      ctx.appliedSubtotal,
    );

    return this.mapToApplyVoucherResult(
      {
        voucher: ctx.voucher,
        subtotal: ctx.subtotal,
        appliedSubtotal: ctx.appliedSubtotal,
        remaining: ctx.remaining,
      },
      discount,
    );
  }
}
