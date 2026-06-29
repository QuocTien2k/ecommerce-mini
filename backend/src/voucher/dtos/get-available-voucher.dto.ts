import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetAvailableVouchersQueryDto {
  @IsNumber()
  @Type(() => Number)
  subtotal: number;
}
