import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TronNetworkExceptionFactory {
  public toThrow(e: unknown): BaseException {
    const error = e as
      | undefined
      | string
      | { error?: string; message?: string };

    if (typeof e === 'undefined') {
      throw new BaseException(
        {
          statusCode: WebErrorsEnum.INTERNAL_ERROR,
          message: 'Unknown tron error',
        },
        e,
      );
    }

    if (
      typeof error === 'string' &&
      error.includes('balance is not sufficient')
    ) {
      throw new BaseException(
        {
          statusCode: WebErrorsEnum.INSUFFICIENT_FUNDS,
          message: 'Insufficient funds',
        },
        e,
      );
    }

    if (
      typeof error === 'string' &&
      error.includes('Invalid amount provided')
    ) {
      throw new BaseException({
        statusCode: WebErrorsEnum.INVALID_AMOUNT_PROVIDED,
        message: 'Invalid amount provided',
      });
    }

    if (
      typeof error === 'object' &&
      error?.message.includes('account does not exist')
    ) {
      throw new BaseException(
        {
          statusCode: WebErrorsEnum.REQUIRED_ACCOUNT_ACTIVATION_TRX,
          message: 'Need activate tron wallet by deposit any amount to wallet',
        },
        e,
      );
    }

    if (typeof e === 'string' && e.includes('Invalid recipient provided')) {
      throw new BaseException(
        {
          statusCode: WebErrorsEnum.INVALID_ARGUMENT,
          message: 'Invalid recipient provided',
        },
        e,
      );
    }

    throw new BaseException(
      {
        statusCode: WebErrorsEnum.INTERNAL_ERROR,
        message: 'Unhandled tron exception',
      },
      e,
    );
  }
}
