import { WalletPgRepository } from '../repositories/wallet-pg.repository';
import { Injectable } from '@nestjs/common';
import { Wallet } from '../dao/entity/wallet';
import { EncryptService } from '@app/encrypt/services/encrypt.service';

export interface CreateTemporaryWalletOptions {
  readonly pubKey: string;
  readonly privateKey: string;
  readonly network: string;
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
    owners,
  }: CreateTemporaryWalletOptions): Promise<Wallet> {
    const temporaryWallet = new Wallet(
      pubKey,
      this.encryptService.encrypt(privateKey),
      network,
      owners,
    );

    return await this.temporaryWalletRepository.save(temporaryWallet);
  }
}
