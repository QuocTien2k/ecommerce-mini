import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'Fullname không được rỗng' })
  fullname: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message: 'Password phải có chữ hoa, chữ thường và số',
  })
  password: string;
}
