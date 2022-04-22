import { Injectable, NotImplementedException } from '@nestjs/common';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import {
  Balance,
  TemporaryWalletService,
  Wallet,
} from '../temporary-wallet.service';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';

@Injectable()
export class BitcoinTemporaryWalletService implements TemporaryWalletService {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(): Promise<Wallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();
    const privateKey = await this.bitcoinRpcClient.dumpPrivateKey(address);

    await this.createTemporaryWalletService.create({
      pubKey: address,
      privateKey: privateKey,
      network: NetworkEnum.BTC,
      coin: CoinEnum.BTC,
    });

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

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<void> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);
    const transactionHex = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
    );
    const signedTransactionHex = await this.bitcoinRpcClient.signRawTransaction(
      transactionHex,
      await this.encryptService.decrypt(wallet.privateKey),
    );
    const tx = await this.bitcoinRpcClient.sendRawTransaction(
      signedTransactionHex,
    );

    console.log(transactionHex);
    console.log(signedTransactionHex);
    console.log(tx);
  }

  public async estimateFee(): Promise<Balance> {
    return {
      amount: await this.bitcoinRpcClient.estimateSmartFee(),
      decimals: 8,
    };
  }
}
