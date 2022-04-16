import { Injectable } from '@nestjs/common';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import {
  Balance,
  TemporaryWalletService,
  Wallet,
} from '../temporary-wallet.service';

@Injectable()
export class BitcoinTemporaryWalletService implements TemporaryWalletService {
  constructor(private readonly bitcoinRpcClient: BitcoinRpcClient) {}

  public async createWallet(): Promise<Wallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();
    const privateKey = await this.bitcoinRpcClient.dumpPrivateKey(address);

    return {
      address,
      privateKey,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.bitcoinRpcClient.getReceivedByAddress(address, 3);

    return {
      amount,
      decimals: 8,
    };
  }
}
