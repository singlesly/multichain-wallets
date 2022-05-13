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
    public toAscii(str: string): string;
  }

  declare class Trx {
    public async getCurrentBlock(): Promise<Block>;

    public async getTransactionInfo(
      transactionId: string,
    ): Promise<TransactionInfo>;

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

    public async getTransaction<T extends TransactionType>(
      transactionId: string,
    ): Promise<SignedTransaction<T>>;

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
    transfer(to: string, amount: number): SendMethod;
  }

  interface CallOptions {
    from?: string;
  }

  interface SendOptions<K> {
    keepTxID: K;
  }

  interface CallMethod<T> {
    call(options?: CallOptions): Promise<T>;
  }

  interface SendMethod {
    send<K extends boolean>(
      options?: SendOptions<K>,
      privateKey: string,
    ): Promise<K extends true ? string : boolean>;
  }

  interface TransactionResult<T> {
    readonly result: boolean;
    readonly txid: string;
    readonly transaction: T;
  }

  interface TransactionData<T extends TransactionType> {
    readonly visible: boolean;
    readonly txID: string;
    readonly raw_data: {
      readonly contract: [Contract<T>];
    };
    readonly raw_data_hex: string;
  }

  interface SignedTransaction<T extends TransactionType = TransferContractType>
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

  export interface TransactionInfo {
    readonly blockNumber: number;
    readonly receipt: {
      result: 'SUCCESS' | string;
    };
  }

  export interface Block {
    readonly blockID: string;
    readonly block_header: {
      raw_data: {
        number: number;
      };
    };
  }

  export type FunctionArgumentTypes = Uint256 | Address;
  export type Uint256 = 'uint256';
  export type Address = 'address';

  export type FunctionSelector = TransferFunctionSelector;
  export type TransferFunctionSelector = 'transfer(address,uint256)';

  export type TransactionType = TransferContractType | TriggerSmartContractType;
  export type TransferContractType = 'TransferContract';
  export type TriggerSmartContractType = 'TriggerSmartContract';

  export type TransferContractParameter = {
    value: {
      amount: number;
      owner_address: string;
      to_address: string;
    };
  };

  export type TriggerSmartContractParameter = {
    value: {
      data: string;
      owner_address: string;
      contract_address: string;
    };
  };

  export type Contract<T = TransferContract> = {
    parameter: T extends TransferContractType
      ? TransferContractParameter
      : T extends TriggerSmartContractType
      ? TriggerSmartContractParameter
      : unknown;
    type: T;
  };

  export type TransferContract = [
    {
      parameter: {
        value: {
          amount: number;
          owner_address: string;
          to_address: string;
        };
      };
      type: TransferContractType;
    },
  ];

  export default TronWeb;
}
