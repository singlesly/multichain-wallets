import { Injectable } from '@nestjs/common';
import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { Wallet } from '../dao/entity/wallet';

@Injectable()
export class GetWalletService {
  constructor(
    private readonly temporaryWalletPgRepository: TemporaryWalletPgRepository,
  ) {}

  public async getByAddress(pubKey: string): Promise<Wallet> {
    return this.temporaryWalletPgRepository.getByAddress(pubKey);
  }
}
