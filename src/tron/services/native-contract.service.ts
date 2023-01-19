import TronWeb, { TransferContractType, TronAccount } from 'tronweb';
import { NativeInterface } from '@app/tron/interfaces/native.interface';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
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
    privateKey: string,
  ): Promise<Balance> {
    const resources = await this.tronWeb.trx.getAccountResources(from);
    const transaction = await this.tronWeb.transactionBuilder.sendTrx(
      to,
      Number(amount),
      from,
    );
    const signedTransaction = await this.tronWeb.trx.sign(
      transaction,
      privateKey,
    );
    let howManyNeed = transaction.raw_data_hex.length;
    for (const sign of signedTransaction.signature) {
      howManyNeed += sign.length;
    }
    howManyNeed = Math.ceil(howManyNeed / 2) + 69;
    const isFree =
      howManyNeed <= resources.freeNetLimit - (resources.freeNetUsed || 0);

    if (isFree) {
      return {
        decimals: this.decimals,
        amount: BigInt(0),
      };
    }

    return {
      decimals: this.decimals,
      amount: BigInt(howManyNeed * 1_000),
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
