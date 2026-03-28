import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsUUID,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  slug: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discountPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPct?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  creatorId: string;
}
