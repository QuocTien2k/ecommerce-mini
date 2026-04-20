import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

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

  // cho admin dugn2
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;
}

export class ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  description?: string;

  price: string;
  discountPrice?: string | null;
  discountPct?: number | null;

  ratingAvg: number;
  ratingCount: number;

  isActive: boolean;

  categoryId: string;

  createdAt: Date;
  updatedAt: Date;
}
