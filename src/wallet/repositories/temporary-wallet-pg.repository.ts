import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from '../dao/entity/wallet';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class TemporaryWalletPgRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repository: Repository<Wallet>,
  ) {}

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

  public async save(temporaryWallet: Wallet): Promise<Wallet> {
    return this.repository.save(temporaryWallet);
  }
}
