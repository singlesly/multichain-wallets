export type ListUnspentResult<A = bigint> = {
  txid: string;
  address: string;
  vout: string;
  confirmations: number;
  spendable: boolean;
  amount: A;
}[];
