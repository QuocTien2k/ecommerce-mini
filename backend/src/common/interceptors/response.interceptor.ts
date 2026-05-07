import { ApiResponse } from '@common/bases/api-response';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const message =
      this.reflector.get<string>('response_message', context.getHandler()) ||
      'Request successful';

    return next.handle().pipe(
      map((data) => {
        // Nếu đã là ApiResponse thì giữ nguyên
        if (data instanceof ApiResponse) {
          return data;
        }

        const statusCode = response.statusCode;

        return new ApiResponse({
          status: true,
          code: statusCode,
          message,
          data,
        });
      }),
    );
  }
}
