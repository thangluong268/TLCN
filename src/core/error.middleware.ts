import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorMiddleware implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status: number = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string = exception.message || 'Internal Server Error';
    const name: string = exception.name || 'HttpException';

    response.status(HttpStatus.OK).json({
      status,
      message,
      name,
      stack: '🥞',
    });
  }
}
