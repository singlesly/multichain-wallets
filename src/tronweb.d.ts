declare module 'tronweb' {
  declare class TronWeb {
    public readonly trx: Trx;

    constructor(options: InitOptions);

    public async createAccount(): Promise<TronAccount>;
  }

  declare class Trx {
    public async getBalance(address: string): Promise<number>;
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

  export default TronWeb;
}
