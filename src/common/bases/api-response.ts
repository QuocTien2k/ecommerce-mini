import { ApiResponseKey } from 'src/enums/api-response-key.enum';
import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T = unknown, M = any> {
  [ApiResponseKey.STATUS]: boolean;
  [ApiResponseKey.CODE]: number;
  [ApiResponseKey.MESSAGE]: string;
  [ApiResponseKey.DATA]?: T;
  [ApiResponseKey.ERRORS]?: Record<string, string[]>;
  [ApiResponseKey.TIMESTAMP]: string;
  meta: M;

  constructor(options: {
    status: boolean;
    code?: number;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    meta?: M;
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

    if (options.meta !== undefined) {
      this.meta = options.meta;
    }

    this.timestamp = new Date().toISOString();
  }
}
