import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseException } from '@app/common/base-exception';
import { Response } from 'express';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  public catch(exception: BaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpException = exception.toHttp;

    response.status(httpException.getStatus()).json(exception.message);
  }
}
