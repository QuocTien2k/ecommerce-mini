import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../bases/api-response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Nếu đã là ApiResponse thì giữ nguyên
        if (data instanceof ApiResponse) {
          return data;
        }

        return new ApiResponse({
          status: true,
          message: 'Request successful',
          data,
        });
      }),
    );
  }
}
