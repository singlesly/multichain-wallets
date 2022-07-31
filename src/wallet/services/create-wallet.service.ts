import { WalletPgRepository } from '../repositories/wallet-pg.repository';
import { Injectable } from '@nestjs/common';
import { Wallet } from '../dao/entity/wallet';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { EncryptService } from '@app/encrypt/services/encrypt.service';

export interface CreateTemporaryWalletOptions {
  readonly pubKey: string;
  readonly privateKey: string;
  readonly network: NetworkEnum;
  readonly coin: CoinEnum;
  readonly owners: string[];
}

@Injectable()
export class CreateWalletService {
  constructor(
    private readonly temporaryWalletRepository: WalletPgRepository,
    private readonly encryptService: EncryptService,
  ) {}

  public async create({
    pubKey,
    privateKey,
    network,
    coin,
    owners,
  }: CreateTemporaryWalletOptions): Promise<Wallet> {
    const temporaryWallet = new Wallet(
      pubKey,
      await this.encryptService.encrypt(privateKey),
      network,
      coin,
      owners,
    );

    return await this.temporaryWalletRepository.save(temporaryWallet);
  }
}
