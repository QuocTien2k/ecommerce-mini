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
import { VoucherType, VoucherScope } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateVoucherDto {
  @Transform(({ value }) => value?.trim().toUpperCase())
  @IsString()
  code: string;

  @IsEnum(VoucherType)
  type: VoucherType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsEnum(VoucherScope)
  scope?: VoucherScope;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
