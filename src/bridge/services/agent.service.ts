import { NativeInterface } from '@app/tron/interfaces/native.interface';
import { TRC20Interface } from '@app/tron/interfaces/trc20.interface';
import { NativeInterface as EthNativeInterface } from '@app/ethereum/interfaces/native.interface';
import { Erc20Interface as EthErc20Interface } from '@app/ethereum/interfaces/erc20.interface';
import {
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
import { Network } from '@app/network/dao/entity/network';
import { Token } from '@app/token/dao/entity/token';

export type SupportedContracts =
  | NativeInterface
  | TRC20Interface
  | EthNativeInterface
  | EthErc20Interface;

export class AgentService implements AgentServiceInterface {
  constructor(
    private readonly network: Network,
    private readonly token: Token,
    private readonly contract: SupportedContracts,
    private readonly createWalletService: CreateWalletService,
    private readonly getWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(owners?: string[]): Promise<Wallet> {
    const account = await this.contract.createWallet();
    const address =
      typeof account.address === 'string'
        ? account.address
        : account.address.base58;

    return this.createWalletService.create({
      privateKey: account.privateKey,
      pubKey: address,
      network: this.network.code,
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
