import { ApiResponse } from '@common/bases/api-response';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

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
          message: 'Request successful',
          data,
        });
      }),
    );
  }
}
