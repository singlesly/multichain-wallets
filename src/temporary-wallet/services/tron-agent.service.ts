import { Injectable, NotImplementedException } from '@nestjs/common';
import { Balance, AgentService, TransactionInfo } from '../agent.service';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { TronClientService } from '@app/tron/services/tron-client.service';
import { base58CheckToHex, hexAddress } from '@app/utils';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';

@Injectable()
export class TronAgentService implements AgentService {
  private readonly decimals: number = 6;

  constructor(
    private readonly tronClientService: TronClientService,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public getTransaction(id: string): Promise<TransactionInfo> {
    throw new NotImplementedException();
  }

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
    const { balance } = await this.tronClientService.getAccountBalance(address);

    return {
      amount: BigInt(balance),
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
