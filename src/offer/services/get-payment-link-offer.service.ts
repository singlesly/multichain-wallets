import { Injectable } from '@nestjs/common';
import {
  GetPaymentLinkResult,
  TinkoffService,
} from '@app/tinkoff/services/tinkoff.service';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { GetPaymentLinkService } from '@app/payment/services/get-payment-link.service';
import { CryptoCurrencyConverterService } from '@app/converter/services/coin-gecko/crypto-currency-converter.service';
import { GetOfferPaymentLinkDto } from '@app/offer/dto/get-offer-payment-link.dto';
import { v4 } from 'uuid';

@Injectable()
export class GetPaymentLinkOfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly tinkoffService: TinkoffService,
    private readonly cryptoCurrencyConverterService: CryptoCurrencyConverterService,
  ) {}

  public async getPaymentLink(
    offerId: string,
    dto: GetOfferPaymentLinkDto,
  ): Promise<GetPaymentLinkResult> {
    const offer = await this.offerRepository.getByIdOrFail(offerId);
    const amount = await this.cryptoCurrencyConverterService.convert(
      {
        amount: BigInt(dto.amountScaled),
        symbol: offer.token.symbol,
        decimals: offer.token.decimals,
      },
      {
        symbol: 'rub',
        decimals: 2,
      },
    );

    return this.tinkoffService.getPaymentLink({
      orderId: v4(),
      amount: Number(amount),
    });
  }
}
