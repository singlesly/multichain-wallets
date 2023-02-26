import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from '../dao/entity/wallet';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

export interface FindOptions {
  readonly owners?: string[];
}

@Injectable()
export class WalletPgRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repository: Repository<Wallet>,
  ) {}

  public async findBy(options: FindOptions): Promise<Wallet[]> {
    const qb = this.repository.createQueryBuilder('w');

    if (options.owners && options.owners.length) {
      qb.where('w.owners @> ARRAY[:...owners]::varchar[]', options);
    }

    return await qb.getMany();
  }

  public async findAll(): Promise<Wallet[]> {
    return await this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async getByAddress(address: string): Promise<Wallet> {
    const wallet = await this.repository.findOne({
      where: {
        pubKey: address,
      },
    });

    if (!wallet) {
      throw new BaseException({
        statusCode: WebErrorsEnum.NOT_FOUND,
        message: 'Wallet not found',
      });
    }

    return wallet;
  }

  public async findByAddress(address: string): Promise<Wallet | null> {
    return await this.repository.findOne({
      where: {
        pubKey: address,
      },
    });
  }

  public async save(temporaryWallet: Wallet): Promise<Wallet> {
    return this.repository.save(temporaryWallet);
  }
}
