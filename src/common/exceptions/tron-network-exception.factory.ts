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
      error.search('balance is not sufficient')
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
      typeof error === 'object' &&
      error?.message.search('account does not exist')
    ) {
      throw new BaseException(
        {
          statusCode: WebErrorsEnum.REQUIRED_ACCOUNT_ACTIVATION_TRX,
          message: 'Need activate tron wallet by deposit any amount to wallet',
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
