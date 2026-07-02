import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumberString,
  IsIn,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class GetProductsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  // filter tên
  @IsOptional()
  @IsString()
  search?: string;

  // filter category
  @IsOptional()
  @IsString()
  categoryId?: string;

  // filter brand
  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  priceSort?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  // cho admin dùng
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}

// export class ProductListItemDto {
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;

//   price: string;
//   discountPrice?: string | null;
//   discountPct?: number | null;

//   ratingAvg: number;
//   ratingCount: number;

//   isActive: boolean;

//   categoryId: string;
//   brandId: string;
//   brand?: {
//     id: string;
//     name: string;
//     slug: string;
//   };

//   createdAt: Date;
//   updatedAt: Date;
// }
