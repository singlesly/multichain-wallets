import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offer } from '@app/offer/dao/entity/offer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfferRepository {
  constructor(
    @InjectRepository(Offer)
    private readonly repository: Repository<Offer>,
  ) {}

  public async getAll(): Promise<Offer[]> {
    return this.repository.find();
  }

  public async getByIdOrFail(id: string): Promise<Offer> {
    const found = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!found) {
      throw new NotFoundException('Offer not found');
    }

    return found;
  }

  public async save(offer: Offer): Promise<void> {
    await this.repository.save(offer);
  }
}
