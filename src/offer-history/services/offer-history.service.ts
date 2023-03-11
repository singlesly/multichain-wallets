import { Injectable } from '@nestjs/common';
import { OfferHistoryRepository } from '@app/offer-history/repositories/offer-history.repository';
import { OfferHistory } from '@app/offer-history/dao/entity/offer-history';
import { Token } from '@app/token/dao/entity/token';
import { OfferDirectionEnum } from '@app/offer/enums/offer-direction.enum';

export interface CreateOfferHistoryOptions {
  token: Token;
  userId: string;
  baseAmountScaled: string;
  quoteAmountScaled: string;
  txId: string;
  direction: OfferDirectionEnum;
}

@Injectable()
export class OfferHistoryService {
  constructor(
    private readonly offerHistoryRepository: OfferHistoryRepository,
  ) {}

  public async getByUserId(userId: string): Promise<OfferHistory[]> {
    return this.offerHistoryRepository.getByUserId(userId);
  }

  public async create(
    options: CreateOfferHistoryOptions,
  ): Promise<OfferHistory> {
    const offerHistory = new OfferHistory(
      options.token,
      options.userId,
      options.baseAmountScaled,
      options.quoteAmountScaled,
      options.txId,
      options.direction,
    );

    await this.offerHistoryRepository.save(offerHistory);

    return offerHistory;
  }
}
