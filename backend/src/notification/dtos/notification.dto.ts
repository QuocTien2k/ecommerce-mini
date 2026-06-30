import { IsOptional, Min, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class NotificationQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isRead?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class NotificationIdDto {
  @IsUUID()
  id: string;
}

export class NotificationResponseDto {
  id: string;
  type: string;
  title: string;
  message: string;
  path?: string;
  orderId?: string;
  orderStatus?: OrderStatus;
  isRead: boolean;
  createdAt: Date;
}
