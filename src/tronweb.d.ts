declare module 'tronweb' {
  declare class TronWeb {
    public readonly trx: Trx;

    constructor(options: InitOptions);

    public async createAccount(): Promise<TronAccount>;
    public contract(): Contact;
  }

  declare class Trx {
    public async getBalance(address: string): Promise<number>;
  }

  declare class Contact {
    at(address: string): Promise<TRC20Contract>;
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

  export default TronWeb;
}
