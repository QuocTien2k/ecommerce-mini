import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { Prisma, Voucher, VoucherScope, VoucherType } from '@prisma/client';
import { AssignVoucherDto } from './dtos/assign-voucher.dto';
import {
  buildPaginatedResponse,
  getPagination,
} from '@common/utils/pagination';
import { GetMyVouchersDto } from './dtos/get-my-voucher.dto';
import { GetVouchersAdminDto } from './dtos/get-voucher-admin.dto';
import { VoucherStatus } from './enum/voucher-status.enum';
import { UpdateVoucherDto } from './dtos/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

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
      scope: dto.scope ?? VoucherScope.ORDER,
      isActive: dto.isActive ?? true,
      startAt: dto.startAt ? new Date(dto.startAt) : null,
      endAt: dto.endAt ? new Date(dto.endAt) : null,

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

  async assignVoucherToUsers(voucherId: string, dto: AssignVoucherDto) {
    const { userIds, usagePerUser } = dto;

    const voucher = await this.prisma.voucher.findUnique({
      where: { id: voucherId },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    if (!voucher.isActive) {
      throw new BadRequestException('Voucher chưa active');
    }

    const now = new Date();

    if (voucher.startAt && voucher.startAt > now) {
      throw new BadRequestException('Voucher chưa đến thời gian sử dụng');
    }

    if (voucher.endAt && voucher.endAt < now) {
      throw new BadRequestException('Voucher đã hết hạn');
    }

    const usage = usagePerUser ?? 1;

    //build data
    const data: Prisma.UserVoucherCreateManyInput[] = userIds.map((userId) => ({
      userId,
      voucherId,
      usagePerUser: usage,
      usedCount: 0,
    }));

    //insert bulk
    const result = await this.prisma.userVoucher.createMany({
      data,
      skipDuplicates: true,
    });

    return {
      assigned: result.count,
    };
  }

  async getMyVouchers(userId: string, query: GetMyVouchersDto) {
    const { page, limit, skip } = getPagination(query);
    const now = new Date();

    const where: Prisma.UserVoucherWhereInput = {
      userId,

      voucher: {
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
      },

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

    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where: {
          ...where,
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.voucher.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

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
      throw new BadRequestException('Voucher đã được assign, không thể update');
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
}
