import { Injectable } from '@nestjs/common';
import {
  Balance,
  AgentService,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { TronClientService } from '@app/tron/services/tron-client.service';
import { base58Address } from '@app/utils';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import TronWeb, { TransferContractType } from 'tronweb';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { TronNetworkExceptionFactory } from '@app/common/exceptions/tron-network-exception.factory';

@Injectable()
export class TronAgentService implements AgentService {
  private readonly decimals: number = 6;

  constructor(
    private readonly tronClientService: TronClientService,
    private readonly tronWeb: TronWeb,
    private readonly createTemporaryWalletService: CreateWalletService,
    private readonly getTemporaryWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
    private readonly tronNetworkExceptionFactory: TronNetworkExceptionFactory,
  ) {}

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction =
      await this.tronWeb.trx.getTransaction<TransferContractType>(id);

    const [{ parameter }] = transaction.raw_data.contract;

    return {
      transactionId: transaction.txID,
      to: base58Address(parameter.value.to_address),
      amount: BigInt(parameter.value.amount),
      from: base58Address(parameter.value.owner_address),
      confirmations: 0,
    };
  }

  public async createWallet(): Promise<Wallet> {
    const account = await this.tronWeb.createAccount();

    return this.createTemporaryWalletService.create({
      privateKey: account.privateKey,
      pubKey: account.address.base58,
      network: NetworkEnum.TRON,
      coin: CoinEnum.TRX,
      owners: [],
    });
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);
    const transaction = await this.tronWeb.transactionBuilder.sendTrx(
      to,
      Number(amount),
      wallet.pubKey,
    );

    return {
      decimals: this.decimals,
      amount: BigInt(transaction.raw_data_hex.length * 1_000),
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const balance = await this.tronWeb.trx.getBalance(address);

    return {
      amount: BigInt(balance),
      decimals: this.decimals,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    try {
      const wallet = await this.getTemporaryWalletService.getByAddress(from);

      const transaction = await this.tronWeb.trx.sendTransaction(
        to,
        Number(amount),
        await this.encryptService.decrypt(wallet.privateKey),
      );

      return transaction.transaction.txID;
    } catch (e) {
      throw this.tronNetworkExceptionFactory.toThrow(e);
    }
  }
}
