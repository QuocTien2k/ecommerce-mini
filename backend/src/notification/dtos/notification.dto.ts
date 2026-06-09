import { IsOptional, Min, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

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
  isRead: boolean;
  createdAt: Date;
}
