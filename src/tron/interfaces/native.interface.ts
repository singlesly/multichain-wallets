import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { TronAccount } from 'tronweb';

export interface NativeInterface {
  getTransaction(id: string): Promise<TransactionInfo>;
  createWallet(): Promise<TronAccount>;
  estimateFee(from: string, to: string, amount: bigint): Promise<Balance>;
  getBalance(address: string): Promise<Balance>;
  transfer(fromPrivateKey: string, to: string, amount: bigint): Promise<TxID>;
}
