import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VoucherType, VoucherScope } from '@prisma/client';
import { VoucherStatus } from '@voucher/enum/voucher-status.enum';

export class GetVouchersAdminDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string; // search code

  @IsOptional()
  @IsEnum(VoucherType)
  type?: VoucherType;

  @IsOptional()
  @IsEnum(VoucherScope)
  scope?: VoucherScope;

  @IsOptional()
  @IsEnum(VoucherStatus)
  status?: VoucherStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
