export interface TemporaryWalletService {
  createWallet(): Promise<Wallet>;
  getBalance(address: string): Promise<Balance>;
}

export interface Wallet {
  readonly address: string;
  readonly privateKey: string;
}

export interface Balance {
  readonly amount: bigint;
  readonly decimals: number;
}
