declare module 'tronweb' {
  declare class TronWeb {
    public readonly trx: Trx;
    public readonly transactionBuilder: TransactionBuilder;
    public readonly address: {
      fromPrivateKey(privateKey: string): string;
    };

    constructor(options: InitOptions);

    public async createAccount(): Promise<TronAccount>;
    public contract(): Contact;
    public setAddress(privateKey: string): void;
  }

  declare class Trx {
    public async getBalance(address: string): Promise<number>;
    public async sign(
      transaction: TransactionData | string,
      privateKey: string,
    ): Promise<SignedTransaction>;
    public async sendTransaction<P>(
      to: string,
      amount: number,
      privateKey?: P,
    ): Promise<
      TransactionResult<P extends string ? SignedTransaction : TransactionData>
    >;

    public async sendRawTransaction(
      transaction: string | SignedTransaction,
    ): Promise<TransactionResult<SignedTransaction>>;

    public async getTransaction(
      transactionId: string,
    ): Promise<SignedTransaction<TransferContract>>;

    public async getUnconfirmedTransactionInfo(
      transactionId: string,
    ): Promise<UnconfirmedTransactionInfo>;

    public async getSignWeight(
      transaction: TransactionData | SignedTransaction,
    ): Promise<SignWeight>;
  }

  declare class Contact {
    at(address: string): Promise<TRC20Contract>;
  }

  declare class TransactionBuilder {
    public async sendTrx(
      to: string,
      amount: number,
      from?: string,
      options?: never,
    ): Promise<SignedTransaction>;

    public async triggerSmartContract<F extends TransferFunctionSelector>(
      contractAddress: string,
      functionSelector: F,
      options: {
        feeLimit?: number;
        callValue?: number;
        tokenValue?: number;
        tokenId?: number;
      },
      parameter: F extends TransferFunctionSelector
        ? [{ type: Address; value: string }, { type: Uint256; value: number }]
        : Record<string, any>[],
      issuerAddress?: string,
    ): Promise<TransactionResult<TransactionData>>;
  }

  interface InitOptions {
    readonly fullNode: string;
    readonly solidityNode: string;
    readonly eventServer?: string;
    readonly privateKey?: string;
  }

  interface TronAccount {
    address: {
      base58: string;
      hex: string;
    };
    publicKey: string;
    privateKey: string;
  }

  export interface TRC20Contract {
    totalSupply(): CallMethod<number>;
    balanceOf(address: string): CallMethod<number>;
    transfer(to: string, amount: number): SendMethod<boolean>;
  }

  interface CallMethod<T> {
    call(): Promise<T>;
  }

  interface SendMethod<T> {
    send(): Promise<T>;
  }

  interface TransactionResult<T> {
    readonly result: boolean;
    readonly txid: string;
    readonly transaction: T;
  }

  interface TransactionData<T = Record<string, never>[]> {
    readonly visible: boolean;
    readonly txID: string;
    readonly raw_data: {
      readonly contract: T;
    };
    readonly raw_data_hex: string;
  }

  interface SignedTransaction<T = Record<string, never>[]>
    extends TransactionData<T> {
    readonly signature: string[];
  }

  interface SignWeight {
    current_weight: number;
  }

  interface UnconfirmedTransactionInfo {
    readonly id: string;
    readonly fee: number;
    readonly receipt: {
      energy_fee: number;
      origin_energy_usage: number;
      energy_usage_total: number;
      net_fee: number;
      result: 'SUCCESS';
    };
  }

  export type FunctionArgumentTypes = Uint256 | Address;
  export type Uint256 = 'uint256';
  export type Address = 'address';

  export type FunctionSelector = TransferFunctionSelector;
  export type TransferFunctionSelector = 'transfer(address,uint256)';

  export type ContractType = 'TransferContract';

  export type TransferContract = [
    {
      parameter: {
        value: {
          amount: number;
          owner_address: string;
          to_address: string;
        };
      };
      type: 'TransferContract';
    },
  ];

  export default TronWeb;
}
