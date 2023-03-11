import { Injectable } from '@nestjs/common';
import {
  GetPaymentLinkResult,
  TinkoffService,
} from '@app/tinkoff/services/tinkoff.service';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { CryptoCurrencyConverterService } from '@app/converter/services/coin-gecko/crypto-currency-converter.service';
import { GetOfferPaymentLinkDto } from '@app/offer/dto/get-offer-payment-link.dto';
import { v4 } from 'uuid';
import { PaymentDataInterface } from '@app/offer/interfaces/payment-data.interface';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';

@Injectable()
export class GetPaymentLinkOfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly tinkoffService: TinkoffService,
    private readonly cryptoCurrencyConverterService: CryptoCurrencyConverterService,
    private readonly env: EnvProviderService,
  ) {}

  public async getPaymentLink(
    offerId: string,
    userId: string,
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

    return this.tinkoffService.getPaymentLink<PaymentDataInterface>({
      orderId: v4(),
      amount: Number(await this.addFee(amount)),
      customerKey: userId,
      notificationUrl: new URL(
        '/api/offer/webhook',
        this.env.getOrFail(LocalEnvPathEnum.APP_URL),
      ).toString(),
      data: {
        offerId,
        recipientWalletAddress: dto.recipientWalletAddress,
        amountScaled: dto.amountScaled,
      },
    });
  }

  public async addFee(amount: bigint): Promise<bigint> {
    return BigInt(Math.ceil(Number(amount) * 1.1));
  }
}
