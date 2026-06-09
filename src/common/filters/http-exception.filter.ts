import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx        = host.switchToHttp();
    const response   = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const raw        = exception.getResponse() as any;

    let message: string = 'An error occurred';
    let errors: any[]   = [];

    if (typeof raw === 'string') {
      message = raw;
    } else if (typeof raw === 'object') {
      const rawMessage = raw.message;

      // ValidationPipe throws UnprocessableEntityException with errors array
      if (statusCode === 422 && Array.isArray(rawMessage)) {
        message = 'Validation failed';
        errors  = rawMessage;
      }
      // ConflictException thrown with { field, message } object
      else if (
        statusCode === 409 &&
        rawMessage &&
        typeof rawMessage === 'object' &&
        rawMessage.field
      ) {
        message = rawMessage.message;
        errors  = [{ field: rawMessage.field, message: rawMessage.message }];
      }
      // Everything else — use message string
      else {
        message =
          typeof rawMessage === 'string'
            ? rawMessage
            : JSON.stringify(rawMessage);
      }
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      data: null,
    });
  }
}
