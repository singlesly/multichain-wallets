export type ListUnspentResult<A = bigint> = {
  txid: string;
  address: string;
  vout: number;
  confirmations: number;
  spendable: boolean;
  amount: A;
}[];

export type DecodeRawTransactionResult = {
  txid: string;
  hash: string;
  size: number;
  vsize: number;
};

export type RawTransactionResult = {
  txid: string;
  confirmations: number;
  vin: { vout: number }[];
  vout: {
    value: number;
    n: number;
    scriptPubKey: {
      address: string;
    };
  }[];
};
