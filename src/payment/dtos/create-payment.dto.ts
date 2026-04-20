import { IsUUID } from 'class-validator';

export class CreateVnpayPaymentDto {
  @IsUUID()
  orderId: string;
}
