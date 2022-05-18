import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionResponse } from '@app/common/base-exception';
import { Response } from 'express';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { LoggerService } from '@ledius/logger';

@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.log({
      label: 'Unhandled Exception',
      error: exception,
    });

    response.status(500).json(
      new BaseExceptionResponse({
        message: 'Internal error',
        statusCode: WebErrorsEnum.INTERNAL_ERROR,
      }),
    );
  }
}
