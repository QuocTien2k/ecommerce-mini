import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
