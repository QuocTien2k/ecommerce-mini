import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  attributes?: Record<string, string | number>;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  // Cloudinary
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value]; // fallback nếu gửi 1 id
      }
    }
    return value;
  })
  removeImagePublicIds?: string[]; // key

  // External
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];
}
