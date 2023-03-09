import { Injectable } from '@nestjs/common';
import { GetPaymentService } from '@app/payment/services/get-payment.service';
import {
  GetPaymentLinkResult,
  TinkoffService,
} from '@app/tinkoff/services/tinkoff.service';
import { CryptoCurrencyConverterService } from '@app/converter/services/coin-gecko/crypto-currency-converter.service';

@Injectable()
export class GetPaymentLinkService {
  constructor(
    private readonly getPaymentService: GetPaymentService,
    private readonly tinkoffService: TinkoffService,
    private readonly cryptoCurrencyConverterService: CryptoCurrencyConverterService,
  ) {}

  public async getPaymentLink(
    paymentId: string,
  ): Promise<GetPaymentLinkResult> {
    const payment = await this.getPaymentService.getPaymentById(paymentId);
    const fiatAmount = payment.getFiatAmount();
    const amount = await this.cryptoCurrencyConverterService.convert(
      {
        amount: BigInt(fiatAmount.amountScaled),
        symbol: fiatAmount.tokenSymbol,
        decimals: fiatAmount.decimals,
      },
      {
        symbol: 'rub',
        decimals: 2,
      },
    );

    return this.tinkoffService.getPaymentLink({
      orderId: payment.orderId,
      amount: Number(amount),
    });
  }
}
