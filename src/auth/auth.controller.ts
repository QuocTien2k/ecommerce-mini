import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dtos/signup.dto';
import { AuthUserResponseDto } from './dtos/auth-user-response.dto';
import { LoginDto } from './dtos/login.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(@Body() data: SignupUserDto): Promise<AuthUserResponseDto> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      //secure: false, // production -> true (HTTPS)
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);

    // set lại cookie (rotate)
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
    };
  }
}
