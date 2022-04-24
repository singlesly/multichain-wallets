import { ForbiddenException, Injectable } from '@nestjs/common';
import { Balance, TemporaryWalletService } from '../temporary-wallet.service';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { TronWeb3Service } from '../../tron/services/tron-web3.service';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { TransactionConfig } from 'web3-core';
import utils from 'web3-utils';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';
import { TronClientService } from '../../tron/services/tron-client.service';

@Injectable()
export class TronTemporaryWalletService implements TemporaryWalletService {
  private readonly decimals: number = 18;

  constructor(
    private readonly tronWeb3Service: TronWeb3Service,
    private readonly tronClientService: TronClientService,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(): Promise<TemporaryWallet> {
    const account = await this.tronClientService.generateAddress();

    return this.createTemporaryWalletService.create({
      privateKey: account.privateKey,
      pubKey: account.address,
      network: NetworkEnum.TRON,
      coin: CoinEnum.TRON,
    });
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const gasPrice = await this.tronWeb3Service.eth.getGasPrice();

    const transactionConfig: TransactionConfig = {
      value: String(amount),
      to,
      from,
    };

    const gas = await this.tronWeb3Service.eth
      .estimateGas(transactionConfig)
      .catch(() => {
        return 0;
      });

    const feeAmount = BigInt(
      utils.toBN(gas).mul(utils.toBN(gasPrice)).toString(),
    );

    return {
      amount: feeAmount,
      decimals: this.decimals,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    return {
      amount: BigInt(await this.tronWeb3Service.eth.getBalance(address)),
      decimals: this.decimals,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<void> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);

    if (wallet.network !== NetworkEnum.TRON) {
      throw new ForbiddenException(
        `Wallet network is ${wallet.network} but not ${NetworkEnum.ETH}`,
      );
    }
    if (wallet.coin !== CoinEnum.TRON) {
      throw new ForbiddenException(
        `Wallet coin is ${wallet.coin} but not ${CoinEnum.ETH}`,
      );
    }
    await this.tronWeb3Service.eth.accounts.wallet.add({
      address: wallet.pubKey,
      privateKey: await this.encryptService.decrypt(wallet.privateKey),
    });

    const transactionConfig: TransactionConfig = {
      value: String(amount),
      to,
      from,
    };

    const receipt = await this.tronWeb3Service.eth.sendTransaction({
      ...transactionConfig,
      gasPrice: await this.tronWeb3Service.eth.getGasPrice(),
      gas: await this.tronWeb3Service.eth.estimateGas(transactionConfig),
    });

    console.log(receipt);
  }
}
