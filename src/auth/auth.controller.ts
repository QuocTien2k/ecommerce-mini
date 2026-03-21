import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dtos/signup.dto';
import { AuthUserResponseDto } from './dtos/auth-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singup(@Body() data: SignupUserDto): Promise<AuthUserResponseDto> {
    return this.authService.singup(data);
  }
}
