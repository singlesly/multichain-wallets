export interface ConverterInterface {
  convert(
    from: { symbol: string; decimals: number; amount: bigint },
    to: { symbol: string; decimals: number },
  ): Promise<bigint>;
}
