import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemporaryWalletPgRepository {
  constructor(
    @InjectRepository(TemporaryWallet)
    private readonly repository: Repository<TemporaryWallet>,
  ) {}

  public async findAll(): Promise<TemporaryWallet[]> {
    return await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async getByAddress(address: string): Promise<TemporaryWallet> {
    const wallet = await this.repository.findOne({
      where: {
        pubKey: address,
      },
    });

    if (!wallet) {
      throw new NotFoundException();
    }

    return wallet;
  }

  public async save(
    temporaryWallet: TemporaryWallet,
  ): Promise<TemporaryWallet> {
    return this.repository.save(temporaryWallet);
  }
}
