import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

export function getRefreshTokenCookieOptions(
  configService: ConfigService,
): CookieOptions {
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}
