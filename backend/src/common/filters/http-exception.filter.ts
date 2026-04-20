import { ApiResponse } from '@common/bases/api-response';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let message = 'Error';
    let errors: any = undefined;
    let meta: any = undefined;


    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message ?? 'Error';
        errors = exceptionResponse.errors;
        meta = exceptionResponse.meta;
      }
    }

    response.status(status).json(
      new ApiResponse({
        status: false,
        code: status,
        message,
        errors,
        meta,
      }),
    );
  }
}
