import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, of, throwError } from 'rxjs';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { handleHttpError } from '@app/common/operators/handleHttpError';

export interface GetPaymentLinkOptions {
  terminalKey?: string;
  amount: number;
  orderId: string;
  ip?: string;
  description?: string;
  token?: string;
  language?: 'ru' | 'en';
  recurrent?: 'Y';
  customerKey?: string;
  notificationUrl?: string;
  successUrl?: string;
  failUrl?: string;
}

export interface GetPaymentLinkResult {
  paymentUrl: string;
}

@Injectable()
export class TinkoffService {
  constructor(
    private readonly http: HttpService,
    private readonly env: EnvProviderService,
  ) {}

  /**
   * https://www.tinkoff.ru/kassa/develop/api/payments/init-description/
   */
  public async getPaymentLink(
    options: GetPaymentLinkOptions,
  ): Promise<GetPaymentLinkResult> {
    return lastValueFrom(
      this.http
        .post('/v2/Init', {
          TerminalKey:
            options.terminalKey ??
            this.env.getOrFail(LocalEnvPathEnum.TINKOFF_ACQUIRING_TERMINAL_KEY),
          Amount: options.amount,
          OrderId: options.orderId,
          IP: options.ip,
          Description: options.description,
          Token: options.token,
          Language: options.language,
          Recurrent: options.recurrent,
          CustomerKey: options.customerKey,
          NotificationURL: options.notificationUrl,
          SuccessURL: options.successUrl,
          FailURL: options.failUrl,
        })
        .pipe(
          handleHttpError,
          map((res) => res.data),
        ),
    );
  }
}
