import TronWeb, { TransferContractType, TronAccount } from 'tronweb';
import { NativeInterface } from '@app/tron/interfaces/native.interface';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { base58Address } from '@app/utils';

export class NativeContractService implements NativeInterface {
  private readonly decimals = 6;

  constructor(private readonly tronWeb: TronWeb) {}

  public async createWallet(): Promise<TronAccount> {
    return await this.tronWeb.createAccount();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const transaction = await this.tronWeb.transactionBuilder.sendTrx(
      to,
      Number(amount),
      from,
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

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction =
      await this.tronWeb.trx.getTransaction<TransferContractType>(id);
    const transactionInfo =
      await this.tronWeb.trx.getUnconfirmedTransactionInfo(id);
    const currentBlock = await this.tronWeb.trx.getCurrentBlock();

    const [{ parameter }] = transaction.raw_data.contract;

    const confirmations =
      currentBlock.block_header.raw_data.number - transactionInfo.blockNumber;

    return {
      transactionId: transaction.txID,
      to: base58Address(parameter.value.to_address),
      amount: BigInt(parameter.value.amount),
      from: base58Address(parameter.value.owner_address),
      confirmations,
    };
  }

  public async transfer(
    fromPrivateKey: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const transaction = await this.tronWeb.trx.sendTransaction(
      to,
      Number(amount),
      fromPrivateKey,
    );

    return transaction.transaction.txID;
  }
}
