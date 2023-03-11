import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '@app/offer/dao/entity/offer';
import { WalletModule } from '@app/wallet/wallet.module';
import { TokenModule } from '@app/token/token.module';
import { CreateOfferService } from '@app/offer/services/create-offer.service';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { OfferController } from '@app/offer/controllers/offer.controller';
import { GetPaymentLinkOfferService } from '@app/offer/services/get-payment-link-offer.service';
import { ConverterModule } from '@app/converter/converter.module';
import { TinkoffModule } from '@app/tinkoff/tinkoff.module';
import { LocalEnvModule } from '@app/local-env/local-env.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WalletModule,
    TokenModule,
    ConverterModule,
    TinkoffModule,
    LocalEnvModule,
  ],
  controllers: [OfferController],
  providers: [CreateOfferService, OfferRepository, GetPaymentLinkOfferService],
})
export class OfferModule {}
