import { NativeInterface } from '@app/tron/interfaces/native.interface';
import { TRC20Interface } from '@app/tron/interfaces/trc20.interface';
import {
  AgentCallOptions,
  AgentServiceInterface,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';

export class AgentService implements AgentServiceInterface {
  constructor(
    private readonly contract: NativeInterface | TRC20Interface,
    private readonly createWalletService: CreateWalletService,
    private readonly getWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(owners?: string[]): Promise<Wallet> {
    const account = await this.contract.createWallet();

    return this.createWalletService.create({
      privateKey: account.privateKey,
      pubKey: account.address.base58,
      network: NetworkEnum.TRON,
      coin: CoinEnum.TRX,
      owners,
    });
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const wallet = await this.getWalletService.getByAddress(from);

    return await this.contract.estimateFee(
      wallet.pubKey,
      to,
      amount,
      await this.encryptService.decrypt(wallet.privateKey),
    );
  }

  public async getBalance(address: string): Promise<Balance> {
    return await this.contract.getBalance(address);
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    return await this.contract.getTransaction(id);
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const wallet = await this.getWalletService.getByAddress(from);

    return await this.contract.transfer(
      await this.encryptService.decrypt(wallet.privateKey),
      to,
      amount,
    );
  }
}
