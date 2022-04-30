import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { Injectable } from '@nestjs/common';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { EncryptService } from '@app/encrypt/services/encrypt.service';

export interface CreateTemporaryWalletOptions {
  readonly pubKey: string;
  readonly privateKey: string;
  readonly network: NetworkEnum;
  readonly coin: CoinEnum;
}

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly temporaryWalletRepository: TemporaryWalletPgRepository,
    private readonly encryptService: EncryptService,
  ) {}

  public async create({
    pubKey,
    privateKey,
    network,
    coin,
  }: CreateTemporaryWalletOptions): Promise<TemporaryWallet> {
    const temporaryWallet = new TemporaryWallet(
      pubKey,
      await this.encryptService.encrypt(privateKey),
      network,
      coin,
    );

    return await this.temporaryWalletRepository.save(temporaryWallet);
  }
}
