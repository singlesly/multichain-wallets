import { Injectable } from '@nestjs/common';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

type AxiosError = {
  response: {
    data: {
      error: { code: number; message: string };
    };
  };
};

type ErrorType = unknown | AxiosError;

@Injectable()
export class BitcoinNetworkExceptionFactory {
  public async toThrow(e: ErrorType): Promise<BaseException> {
    if (
      typeof e === 'object' &&
      (e as AxiosError).response.data.error.message.includes(
        'Insufficient funds',
      )
    ) {
      throw new BaseException({
        statusCode: WebErrorsEnum.INSUFFICIENT_FUNDS,
        message: 'Insufficient funds',
      });
    }

    return new BaseException(
      {
        statusCode: WebErrorsEnum.INTERNAL_ERROR,
        message: 'Unhandled tron exception',
      },
      e,
    );
  }
}
