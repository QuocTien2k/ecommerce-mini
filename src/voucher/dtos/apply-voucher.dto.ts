import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ApplyVoucherItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class ApplyVoucherDto {
  @IsString()
  voucherCode: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplyVoucherItemDto)
  items: ApplyVoucherItemDto[];
}
