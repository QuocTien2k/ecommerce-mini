import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { VoucherType, VoucherScope, VoucherTarget } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateVoucherDto {
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsString()
  code: string;

  @IsEnum(VoucherType)
  type: VoucherType;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  value: number;

  @ValidateIf((o) => o.type === VoucherType.PERCENT)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  // bắt buộc
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit: number;

  @IsOptional()
  @IsEnum(VoucherScope)
  scope?: VoucherScope;

  @IsOptional()
  @IsEnum(VoucherTarget)
  target?: VoucherTarget;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // bắt buộc
  @IsDateString()
  startAt: string;

  // bắt buộc
  @IsDateString()
  endAt: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
