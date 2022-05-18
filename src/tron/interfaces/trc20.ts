export interface TRC20 {
  totalSupply(): Promise<bigint>;
  balanceOf(address: string): Promise<bigint>;
  transfer(to: string, amount: bigint, privateKey: string): Promise<string>;
}
