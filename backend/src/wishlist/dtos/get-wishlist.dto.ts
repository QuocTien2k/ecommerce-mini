import { IsNumberString, IsOptional } from 'class-validator';

export class GetWishlistQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
