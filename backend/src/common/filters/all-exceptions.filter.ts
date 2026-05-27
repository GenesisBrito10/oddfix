import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sanitizeMessage, sanitizePayload } from '../errors/error-sanitizer';

/**
 * Global error boundary. Known HttpExceptions pass through (status + sanitized
 * payload); anything else becomes a generic 500 with no internals leaked. The
 * stack trace is logged only outside production.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = process.env.NODE_ENV === 'production';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = sanitizePayload(exception.getResponse());
      const body =
        typeof payload === 'object' && payload !== null
          ? payload
          : {
              statusCode: status,
              message: payload,
              timestamp: new Date().toISOString(),
              path: request.url,
            };
      response.status(status).json(body);
      return;
    }

    // Unknown / unexpected error: never expose details to the client.
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const detail =
      exception instanceof Error
        ? sanitizeMessage(exception.message)
        : 'Unknown error';
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${detail}`,
      !isProduction && exception instanceof Error ? exception.stack : undefined,
    );
    response.status(status).json({
      statusCode: status,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
