import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { Web3Account } from 'web3-eth-accounts';

export interface Bep20Interface {
  getTransaction(id: string): Promise<TransactionInfo>;
  createWallet(): Promise<Web3Account>;
  estimateFee(
    from: string,
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<Balance>;
  getBalance(address: string): Promise<Balance>;
  transfer(fromPrivateKey: string, to: string, amount: bigint): Promise<TxID>;
}
