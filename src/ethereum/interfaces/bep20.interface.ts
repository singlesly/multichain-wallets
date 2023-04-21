import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { Account } from 'web3-core';

export interface Bep20Interface {
  getTransaction(id: string): Promise<TransactionInfo>;
  createWallet(): Promise<Account>;
  estimateFee(
    from: string,
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<Balance>;
  getBalance(address: string): Promise<Balance>;
  transfer(fromPrivateKey: string, to: string, amount: bigint): Promise<TxID>;
}
