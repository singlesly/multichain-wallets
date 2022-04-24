import {
  ForbiddenException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
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
import { base58CheckToHex } from '../../utils';

@Injectable()
export class TronTemporaryWalletService implements TemporaryWalletService {
  private readonly decimals: number = 6;

  constructor(
    private readonly tronWeb3Service: TronWeb3Service,
    private readonly tronClientService: TronClientService,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
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
    throw new NotImplementedException();
  }

  public async getBalance(address: string): Promise<Balance> {
    const account = await this.tronClientService.getAccount(
      base58CheckToHex(address),
    );

    return {
      amount: account.balance,
      decimals: this.decimals,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<void> {
    throw new NotImplementedException();
  }
}
