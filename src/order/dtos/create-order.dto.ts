import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  Length,
  IsArray,
  ValidateNested,
  IsUUID,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.input';

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  // Voucher (optional)
  @IsOptional()
  @IsString()
  @Length(3, 50)
  voucherCode?: string;

  // Receiver snapshot
  @IsString()
  @Length(2, 100)
  receiverName: string;

  @IsPhoneNumber('VN') // chuẩn VN
  receiverPhone: string;

  @IsString()
  @Length(5, 255)
  receiverAddress: string;

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
