import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseException } from '@app/common/base-exception';
import { Response } from 'express';
import {LoggerService} from "@ledius/logger";

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(
      private readonly logger: LoggerService
  ) {
  }

  public catch(exception: BaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpException = exception.toHttp;

    this.logger.error(exception);

    response.status(httpException.getStatus()).json(exception.message);
  }
}
