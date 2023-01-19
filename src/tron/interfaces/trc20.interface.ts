import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { TronAccount } from 'tronweb';

export interface TRC20Interface {
  getTransaction(id: string): Promise<TransactionInfo>;
  createWallet(): Promise<TronAccount>;
  estimateFee(
    from: string,
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<Balance>;
  getBalance(address: string): Promise<Balance>;
  transfer(fromPrivateKey: string, to: string, amount: bigint): Promise<TxID>;
}
