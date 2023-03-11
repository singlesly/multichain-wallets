import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferHistory } from '@app/offer-history/dao/entity/offer-history';
import { OfferHistoryController } from '@app/offer-history/controllers/offer-history.controller';
import { OfferHistoryService } from '@app/offer-history/services/offer-history.service';
import { OfferHistoryRepository } from '@app/offer-history/repositories/offer-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OfferHistory])],
  controllers: [OfferHistoryController],
  providers: [OfferHistoryService, OfferHistoryRepository],
  exports: [OfferHistoryService],
})
export class OfferHistoryModule {}
