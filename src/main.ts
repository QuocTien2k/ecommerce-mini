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

        validationErrors.forEach((error) => {
          const field = error.property;

          if (error.constraints) {
            errors[field] = Object.values(error.constraints);
          }

          // handle nested object nếu cần
          if (error.children && error.children.length > 0) {
            error.children.forEach((child) => {
              const childField = `${field}.${child.property}`;
              if (child.constraints) {
                errors[childField] = Object.values(child.constraints);
              }
            });
          }
        });

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

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log(`🚀 Server is running at http://localhost:${port}`);
}
bootstrap();
