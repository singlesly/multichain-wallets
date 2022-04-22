import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Balance,
  TemporaryWalletService,
  Wallet,
} from '../temporary-wallet.service';
import { EthereumWeb3Service } from '../../ethereum/services/ethereum-web3.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { TransactionConfig } from 'web3-core';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';

@Injectable()
export class EthereumTemporaryWalletService implements TemporaryWalletService {
  constructor(
    private readonly ethereumWeb3Service: EthereumWeb3Service,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptorService: EncryptService,
  ) {}

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<void> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);

    if (wallet.network !== NetworkEnum.ETH) {
      throw new ForbiddenException(
        `Wallet network is ${wallet.network} but not ${NetworkEnum.ETH}`,
      );
    }
    if (wallet.coin !== CoinEnum.ETH) {
      throw new ForbiddenException(
        `Wallet coin is ${wallet.coin} but not ${CoinEnum.ETH}`,
      );
    }
    await this.ethereumWeb3Service.eth.accounts.wallet.add({
      address: wallet.pubKey,
      privateKey: await this.encryptorService.decrypt(wallet.privateKey),
    });

    const transactionConfig: TransactionConfig = {
      value: String(amount),
      to,
      from,
    };

    const receipt = await this.ethereumWeb3Service.eth.sendTransaction({
      ...transactionConfig,
      gasPrice: await this.ethereumWeb3Service.eth.getGasPrice(),
      gas: await this.ethereumWeb3Service.eth.estimateGas(transactionConfig),
    });

    console.log(receipt);
  }

  public async createWallet(): Promise<Wallet> {
    const account = await this.ethereumWeb3Service.eth.accounts.create();

    const wallet = await this.createTemporaryWalletService.create({
      pubKey: account.address,
      privateKey: account.privateKey,
      network: NetworkEnum.ETH,
      coin: CoinEnum.ETH,
    });

    return {
      address: wallet.pubKey,
      privateKey: wallet.privateKey,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.ethereumWeb3Service.eth.getBalance(address);

    return {
      amount: BigInt(amount),
      decimals: 18,
    };
  }
}
