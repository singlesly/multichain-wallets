import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import {
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { TemporaryWallet } from '@app/wallet/dao/entity/temporary-wallet';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';

@Injectable()
export class UsdtTrc20AgentService implements AgentService {
  constructor(private readonly usdtClientService: USDTClientService) {}

  public async createWallet(): Promise<TemporaryWallet> {
    throw new ForbiddenException();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    return Promise.resolve(undefined);
  }

  public async getBalance(address: string): Promise<Balance> {
    return Promise.resolve(undefined);
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    return Promise.resolve(undefined);
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    return Promise.resolve(undefined);
  }
}
