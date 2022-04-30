import { Injectable } from '@nestjs/common';
import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';

@Injectable()
export class GetWalletService {
  constructor(
    private readonly temporaryWalletPgRepository: TemporaryWalletPgRepository,
  ) {}

  public async getByAddress(pubKey: string): Promise<TemporaryWallet> {
    return this.temporaryWalletPgRepository.getByAddress(pubKey);
  }
}
