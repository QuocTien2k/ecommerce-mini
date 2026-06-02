import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  attributes?: Record<string, string | number>;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  imageUrls?: string[];
}
