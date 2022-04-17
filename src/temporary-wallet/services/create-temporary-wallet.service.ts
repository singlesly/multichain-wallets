import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { Injectable } from '@nestjs/common';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';

export interface CreateTemporaryWalletOptions {
  readonly pubKey: string;
  readonly privateKey: string;
}

@Injectable()
export class CreateTemporaryWalletService {
  constructor(
    private readonly temporaryWalletRepository: TemporaryWalletPgRepository,
  ) {}

  public async create({
    pubKey,
    privateKey,
  }: CreateTemporaryWalletOptions): Promise<TemporaryWallet> {
    const temporaryWallet = new TemporaryWallet(pubKey, privateKey);

    return await this.temporaryWalletRepository.save(temporaryWallet);
  }
}
