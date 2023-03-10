import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '@app/offer/dao/entity/offer';
import { WalletModule } from '@app/wallet/wallet.module';
import { TokenModule } from '@app/token/token.module';
import { CreateOfferService } from '@app/offer/services/create-offer.service';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { OfferController } from '@app/offer/controllers/offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), WalletModule, TokenModule],
  controllers: [OfferController],
  providers: [CreateOfferService, OfferRepository],
})
export class OfferModule {}
