import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemporaryWalletPgRepository {
  constructor(
    @InjectRepository(TemporaryWallet)
    private readonly repository: Repository<TemporaryWallet>,
  ) {}

  public async save(
    temporaryWallet: TemporaryWallet,
  ): Promise<TemporaryWallet> {
    return this.repository.save(temporaryWallet);
  }
}
