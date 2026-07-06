import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum DashboardTopProductMetric {
  QUANTITY = 'quantity',
  REVENUE = 'revenue',
  ORDERS = 'orders',
  RATING = 'rating',
}

export class DashboardTopProductsFilterDto {
  @IsOptional()
  @IsEnum(DashboardTopProductMetric)
  metric?: DashboardTopProductMetric;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class DashboardTopProductDto {
  productId: string;
  name: string;
  thumbnail: string;

  value: number;
}

export type TopProductRow = {
  productId: string;
  name: string;
  thumbnail: string;
  value: number;
};
