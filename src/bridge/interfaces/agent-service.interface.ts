import { Wallet } from '@app/wallet/dao/entity/wallet';

export interface AgentServiceInterface {
  createWallet(owners?: string[]): Promise<Wallet>;
  getBalance(address: string): Promise<Balance>;
  transfer(
    from: string,
    to: string,
    amount: bigint,
    options: AgentCallOptions,
  ): Promise<TxID>;
  estimateFee(from: string, to: string, amount: bigint): Promise<Balance>;
  getTransaction(id: string): Promise<TransactionInfo>;
}

export type TxID = string;

export interface Balance {
  readonly amount: bigint;
  readonly decimals: number;
}

export interface TransactionInfo {
  readonly transactionId: string;
  readonly from: string;
  readonly to: string;
  readonly amount: bigint;
  readonly confirmations: number;
  readonly isConfirmed: boolean;
}

export interface AgentCallOptions {
  readonly initiator: string;
}
