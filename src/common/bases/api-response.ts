import { ApiResponseKey } from 'src/enums/api-response-key.enum';
import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  [ApiResponseKey.STATUS]: boolean;
  [ApiResponseKey.CODE]: number;
  [ApiResponseKey.MESSAGE]: string;
  [ApiResponseKey.DATA]?: T;
  [ApiResponseKey.ERRORS]?: Record<string, string[]>;
  [ApiResponseKey.TIMESTAMP]: string;

  constructor(options: {
    status: boolean;
    code?: number;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
  }) {
    this.status = options.status;
    this.code = options.code ?? HttpStatus.OK;
    this.message = options.message;

    if (options.data !== undefined) {
      this.data = options.data;
    }

    if (options.errors !== undefined) {
      this.errors = options.errors;
    }

    this.timestamp = new Date().toISOString();
  }
}
