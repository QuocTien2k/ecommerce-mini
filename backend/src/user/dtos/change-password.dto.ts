import { Match } from '@common/decorators/match.decorator';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message: 'Mật khẩu phải có chữ hoa, chữ thường và số',
  })
  newPassword: string;

  @IsString()
  @Match('newPassword', { message: 'Mật khẩu không khớp' })
  confirmPassword: string;
}
