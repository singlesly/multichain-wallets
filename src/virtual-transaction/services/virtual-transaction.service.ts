import { Injectable } from '@nestjs/common';
import { VirtualTransactionPgRepository } from '@app/virtual-transaction/repositories/virtual-transaction-pg.repository';
import { VirtualBalanceService } from '@app/virtual-balance/services/virtual-balance.service';
import { VirtualTransaction } from '@app/virtual-transaction/dao/entity/virtual-transaction';
import { CoinEnum } from '@app/common/coin.enum';
import { NetworkEnum } from '@app/common/network.enum';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { v4 } from 'uuid';

export interface SubmitTransactionOptions {
  readonly from: string;
  readonly to: string;
  readonly amount: bigint;
  readonly note?: string;
}

@Injectable()
export class VirtualTransactionService {
  constructor(
    private readonly virtualTransactionPgRepository: VirtualTransactionPgRepository,
    private readonly virtualBalanceService: VirtualBalanceService,
    private readonly getWalletService: GetWalletService,
  ) {}

  public async getById(
    transactionId: string,
  ): Promise<VirtualTransaction | null> {
    return this.virtualTransactionPgRepository.getById(transactionId);
  }

  public async submit(
    options: SubmitTransactionOptions,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<VirtualTransaction> {
    const { from, to, amount } = options;
    const [fromWallet, toWallet] = await Promise.all([
      this.getWalletService.getByAddress(from),
      this.getWalletService.getByAddress(to),
    ]);
    await this.virtualBalanceService.transfer(
      fromWallet.id,
      toWallet.id,
      amount,
      network,
      coin,
    );

    return await this.virtualTransactionPgRepository.save(
      new VirtualTransaction(from, to, amount, network, coin, v4()),
    );
  }
}
