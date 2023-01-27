import { Injectable } from '@nestjs/common';
import { WalletPgRepository } from '../repositories/wallet-pg.repository';
import { Wallet } from '../dao/entity/wallet';

@Injectable()
export class GetWalletService {
  constructor(
    private readonly temporaryWalletPgRepository: WalletPgRepository,
  ) {}

  public async getByAddress(pubKey: string): Promise<Wallet> {
    return this.temporaryWalletPgRepository.getByAddress(pubKey);
  }

  public async findByAddress(pubKey: string): Promise<Wallet | undefined> {
    return this.temporaryWalletPgRepository.findByAddress(pubKey);
  }

  public async getWallets(options: { owners?: string[] }): Promise<Wallet[]> {
    return await this.temporaryWalletPgRepository.findBy({
      owners: options.owners,
    });
  }
}
