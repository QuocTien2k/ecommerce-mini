import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
