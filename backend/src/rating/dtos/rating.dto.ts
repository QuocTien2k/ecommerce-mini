import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class RatingDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
