import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug không hợp lệ',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  discountPct?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  categoryId: string;
}
