import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';
import { MailService } from './mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableShutdownHooks();

  // Validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors: Record<string, string[]> = {};

        const extractErrors = (errs: ValidationError[], parentPath = '') => {
          for (const err of errs) {
            const fieldPath = parentPath
              ? `${parentPath}.${err.property}`
              : err.property;

            if (err.constraints) {
              errors[fieldPath] = Object.values(err.constraints);
            }

            if (err.children && err.children.length > 0) {
              extractErrors(err.children, fieldPath);
            }
          }
        };

        extractErrors(validationErrors);

        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  // Exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log(`🚀 Server is running at http://localhost:${port}`);
}
bootstrap();
