import { Injectable, NotImplementedException } from '@nestjs/common';
import { Balance, TemporaryWalletService } from '../temporary-wallet.service';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { TronClientService } from '../../tron/services/tron-client.service';
import { base58CheckToHex, hexAddress } from '../../utils';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';

@Injectable()
export class TronTemporaryWalletService implements TemporaryWalletService {
  private readonly decimals: number = 6;

  constructor(
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
    const wallet = await this.getTemporaryWalletService.getByAddress(from);
    const transaction = await this.tronClientService.createTransaction({
      amount,
      toAddress: hexAddress(to),
      ownerAddress: hexAddress(wallet.pubKey),
    });

    return {
      decimals: this.decimals,
      amount: BigInt(transaction.raw_data_hex.length * 1_000),
    };
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
    const wallet = await this.getTemporaryWalletService.getByAddress(from);

    await this.tronClientService.easyTransferByPrivate({
      privateKey: await this.encryptService.decrypt(wallet.privateKey),
      toAddress: base58CheckToHex(to),
      amount: amount,
    });
  }
}
