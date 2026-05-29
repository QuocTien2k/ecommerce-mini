import { VoucherScope, VoucherType } from '@prisma/client';
import { IsUUID } from 'class-validator';

export class GetVoucherDetailAdminDto {
  @IsUUID()
  voucherId: string;
}

export class VoucherDetailAdminResponseDto {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit?: number | null;
  usedCount: number;
  scope: VoucherScope;
  isActive: boolean;
  startAt: Date | null;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Dùng để hiển thị trên modal admin
  productIds: string[];
  categoryIds: string[];

  // Dùng để hiển thị tên cho admin
  products: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}
