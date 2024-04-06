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
import { Network } from '@app/network/dao/entity/network';
import { Token } from '@app/token/dao/entity/token';
import { ContractCallableInterface } from '@app/ethereum/interfaces/contract-callable.interface';

export type SupportedContracts = EthNativeInterface | EthErc20Interface;

export class AgentService implements AgentServiceInterface {
  constructor(
    private readonly network: Network,
    private readonly token: Token,
    private readonly contract: SupportedContracts,
    private readonly createWalletService: CreateWalletService,
    private readonly getWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(owners: string[] = []): Promise<Wallet> {
    const account = await this.contract.createWallet();
    const address = account.address;

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

  public async request<T = void>(
    from: string,
    type: 'call' | 'send',
    methodName: string,
    ...params: string[]
  ): Promise<T> {
    const wallet = await this.getWalletService.getByAddress(from);

    const method = (this.contract as unknown as ContractCallableInterface)[
      type
    ];

    return method.call(
      this.contract,
      await this.encryptService.decrypt(wallet.privateKey),
      methodName,
      ...params,
    );
  }
}
