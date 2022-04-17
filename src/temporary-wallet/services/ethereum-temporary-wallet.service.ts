import { Injectable } from '@nestjs/common';
import {
  Balance,
  TemporaryWalletService,
  Wallet,
} from '../temporary-wallet.service';
import { EthereumWeb3Service } from '../../ethereum/services/ethereum-web3.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';

@Injectable()
export class EthereumTemporaryWalletService implements TemporaryWalletService {
  constructor(
    private readonly ethereumWeb3Service: EthereumWeb3Service,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
  ) {}

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
