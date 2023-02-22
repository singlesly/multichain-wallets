import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { lastValueFrom, map } from 'rxjs';

export interface GetPaymentLinkOptions {
  amount: number;
  merchantOrderId: string;
}

export interface GetPaymentLinkResult {}

@Injectable()
export class HttpEpayService {
  constructor(
    private readonly http: HttpService,
    @Inject('API_KEY')
    private readonly apiKey: string,
  ) {}

  public getPaymentLink(
    options: GetPaymentLinkOptions,
  ): Promise<GetPaymentLinkResult> {
    const params = new URLSearchParams();
    params.set('amount', options.amount.toString(10));
    params.set('merchant_order_id', options.merchantOrderId);
    params.set('card_number', '1');
    params.set('card_year', '1');
    params.set('card_month', '1');
    params.set('card_cvc', '1');
    params.set('country', 'RU');
    params.set('api_key', this.apiKey);
    params.set('json', '1');
    params.set('use_system_forms', '1');

    return lastValueFrom(
      this.http
        .post<GetPaymentLinkResult>('/api/request/', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: params,
        })
        .pipe(map((res) => res.data)),
    );
  }
}
