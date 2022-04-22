export interface TemporaryWalletService {
  createWallet(): Promise<Wallet>;
  getBalance(address: string): Promise<Balance>;
  transfer(from: string, to: string, amount: bigint): Promise<void>;
  estimateFee(from: string, to: string, amount: bigint): Promise<Balance>;
}

export interface Wallet {
  readonly address: string;
  readonly privateKey: string;
}

export interface Balance {
  readonly amount: bigint;
  readonly decimals: number;
}
