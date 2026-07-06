import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  logoPublicId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  hotline1?: string;

  @IsOptional()
  @IsString()
  hotline2?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  workingHours?: string;

  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;

  @IsOptional()
  @IsUrl()
  tiktokUrl?: string;

  @IsOptional()
  @IsUrl()
  zaloUrl?: string;

  @IsOptional()
  @IsUrl()
  googleMapUrl?: string;
}
