import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DashboardRevenueFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  @Max(2100)
  year?: number;
}

export class DashboardRevenueItemDto {
  label: string;
  revenue: number;
}

export type RevenueRow = {
  month: number;
  revenue: number;
};
