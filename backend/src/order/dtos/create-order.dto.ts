import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  Length,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.input';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  // Voucher (optional)
  @IsOptional()
  @IsString()
  @Length(3, 50)
  voucherCode?: string | null;

  // Receiver snapshot
  @IsString()
  @Length(2, 100)
  receiverName: string;

  @IsPhoneNumber('VN')
  receiverPhone: string;

  @IsString()
  @Length(5, 255)
  receiverAddress: string;

  // Payment
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  // Metadata
  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;

  // Items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
