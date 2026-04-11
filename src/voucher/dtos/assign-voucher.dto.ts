import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AssignVoucherDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usagePerUser?: number;
}
