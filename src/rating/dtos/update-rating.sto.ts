import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRatingDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
