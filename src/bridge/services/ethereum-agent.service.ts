import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Balance,
  AgentService,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { TransactionConfig } from 'web3-core';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import utils from 'web3-utils';
import { TemporaryWallet } from '@app/wallet/dao/entity/temporary-wallet';

@Injectable()
export class EthereumAgentService implements AgentService {
  constructor(
    private readonly ethereumWeb3Service: EthereumWeb3Service,
    private readonly createTemporaryWalletService: CreateWalletService,
    private readonly getTemporaryWalletService: GetWalletService,
    private readonly encryptorService: EncryptService,
  ) {}

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction = await this.ethereumWeb3Service.eth.getTransaction(id);
    const currentBlock = await this.ethereumWeb3Service.eth.getBlockNumber();

    const confirmations =
      transaction.blockNumber === null
        ? 0
        : currentBlock - transaction.blockNumber;

    return {
      amount: BigInt(transaction.value),
      to: transaction.to,
      transactionId: transaction.hash,
      from: transaction.from,
      confirmations: confirmations,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
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

    return receipt.transactionHash;
  }

  public async createWallet(): Promise<TemporaryWallet> {
    const account = await this.ethereumWeb3Service.eth.accounts.create();

    return await this.createTemporaryWalletService.create({
      pubKey: account.address,
      privateKey: account.privateKey,
      network: NetworkEnum.ETH,
      coin: CoinEnum.ETH,
    });
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.ethereumWeb3Service.eth.getBalance(address);

    return {
      amount: BigInt(amount),
      decimals: 18,
    };
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const gasPrice = await this.ethereumWeb3Service.eth.getGasPrice();

    const transactionConfig: TransactionConfig = {
      value: String(amount),
      to,
      from,
    };

    const gas = await this.ethereumWeb3Service.eth
      .estimateGas(transactionConfig)
      .catch(() => {
        return 0;
      });

    const feeAmount = BigInt(
      utils.toBN(gas).mul(utils.toBN(gasPrice)).toString(),
    );

    return {
      amount: feeAmount,
      decimals: 18,
    };
  }
}
