declare module 'tronweb' {
  declare class TronWeb {
    constructor(options: InitOptions);

    public async createAccount(): Promise<TronAccount>;
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
