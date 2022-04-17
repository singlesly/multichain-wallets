import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { Injectable } from '@nestjs/common';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';

export interface CreateTemporaryWalletOptions {
  readonly pubKey: string;
  readonly privateKey: string;
  readonly network: NetworkEnum;
  readonly coin: CoinEnum;
}

@Injectable()
export class CreateTemporaryWalletService {
  constructor(
    private readonly temporaryWalletRepository: TemporaryWalletPgRepository,
  ) {}

  public async create({
    pubKey,
    privateKey,
    network,
    coin,
  }: CreateTemporaryWalletOptions): Promise<TemporaryWallet> {
    const temporaryWallet = new TemporaryWallet(
      pubKey,
      privateKey,
      network,
      coin,
    );

    return await this.temporaryWalletRepository.save(temporaryWallet);
  }
}
