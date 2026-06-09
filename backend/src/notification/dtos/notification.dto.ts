import { IsOptional, IsBooleanString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class NotificationQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isRead?: boolean;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}

export class NotificationIdDto {
  @IsUUID()
  id: string;
}
