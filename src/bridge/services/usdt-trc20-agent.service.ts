import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import {
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { TemporaryWallet } from '@app/wallet/dao/entity/temporary-wallet';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import TronWeb from 'tronweb';
import { base58Address } from '@app/utils';

@Injectable()
export class UsdtTrc20AgentService implements AgentService {
  constructor(
    private readonly tronWeb: TronWeb,
    private readonly usdtClientService: USDTClientService,
    private readonly getWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
  ) {}

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
    const amount = await this.usdtClientService.balanceOf(address);

    return {
      decimals: await this.usdtClientService.getDecimals(),
      amount,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction = await this.tronWeb.trx.getTransaction(id);

    const [{ parameter }] = transaction.raw_data.contract;

    return {
      transactionId: transaction.txID,
      to: base58Address(parameter.value.to_address),
      amount: BigInt(parameter.value.amount),
      from: base58Address(parameter.value.owner_address),
      confirmations: 0,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const wallet = await this.getWalletService.getByAddress(from);

    const transactionId = await this.usdtClientService.transfer(
      to,
      amount,
      await this.encryptService.decrypt(wallet.privateKey),
    );

    return transactionId;
  }
}
