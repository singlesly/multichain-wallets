import {
  AgentCallOptions,
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { VirtualTransactionService } from '@app/virtual-transaction/services/virtual-transaction.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { VirtualBalanceService } from '@app/virtual-balance/services/virtual-balance.service';
import { FeatureService } from '@ledius/feature/dist/services/feature.service';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class VirtualAgentService implements AgentService {
  constructor(
    private readonly agentService: AgentService,
    private readonly virtualBalanceService: VirtualBalanceService,
    private readonly virtualTransactionService: VirtualTransactionService,
    private readonly getWalletService: GetWalletService,
    private readonly features: FeatureService,
  ) {}

  public async createWallet(owners?: string[]): Promise<Wallet> {
    return this.agentService.createWallet(owners);
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    return this.agentService.estimateFee(from, to, amount);
  }

  public async getBalance(address: string): Promise<Balance> {
    const wallet = await this.getWalletService.getByAddress(address);

    const virtualBalance = await this.virtualBalanceService.getBalance(
      wallet.id,
      wallet.network,
      wallet.coin,
    );
    const virtualAmount = this.features.isOn(
      LocalEnvPathEnum.FEATURE_VIRTUAL_BALANCES,
    )
      ? virtualBalance.balance
      : BigInt(0);

    const balance = await this.agentService.getBalance(address);

    return {
      decimals: balance.decimals,
      amount: balance.amount + virtualAmount,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    if (!isUUID(id)) {
      return this.agentService.getTransaction(id);
    }

    const virtualTransaction = await this.virtualTransactionService.getById(id);
    if (virtualTransaction) {
      return {
        transactionId: virtualTransaction.id,
        amount: virtualTransaction.amount,
        to: virtualTransaction.to,
        from: virtualTransaction.from,
        confirmations: 1000,
      };
    }

    return this.agentService.getTransaction(id);
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
    options: AgentCallOptions,
  ): Promise<TxID> {
    const internalRecipient = await this.getWalletService.findByAddress(to);

    if (internalRecipient) {
      const transaction = await this.virtualTransactionService.submit(
        {
          from,
          to,
          amount,
        },
        NetworkEnum.BTC,
        CoinEnum.BTC,
      );

      return transaction.id;
    }

    return this.agentService.transfer(from, to, amount, options);
  }
}
