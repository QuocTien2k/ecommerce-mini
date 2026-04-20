import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0' })
  quantity: number;
}
