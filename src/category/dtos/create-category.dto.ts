import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 120)
  slug: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imagePublicId?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
