import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';
import { Prisma, VoucherScope, VoucherType } from '@prisma/client';

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
}
