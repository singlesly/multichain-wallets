declare module 'tronweb' {
  declare class TronWeb {
    public readonly trx: Trx;

    constructor(options: InitOptions);

    public async createAccount(): Promise<TronAccount>;
    public contract(): Contact;
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

    public async getTransaction(
      transactionId: string,
    ): Promise<SignedTransaction<TransferContract>>;
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

  interface TRC20Contract {
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
