import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OfferHistory } from '@app/offer-history/dao/entity/offer-history';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfferHistoryRepository {
  constructor(
    @InjectRepository(OfferHistory)
    private readonly repository: Repository<OfferHistory>,
  ) {}

  public async getByUserId(userId: string): Promise<OfferHistory[]> {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }

  public async save(offerHistory: OfferHistory): Promise<void> {
    await this.repository.save(offerHistory);
  }
}
