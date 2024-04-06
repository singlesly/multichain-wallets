import { ConsoleLogger, Injectable } from '@nestjs/common';
import { NativeInterface } from '@app/ethereum/interfaces/native.interface';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { Token } from '@app/token/dao/entity/token';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import utils from 'web3-utils';
import { Web3Account } from 'web3-eth-accounts';
import { Transaction } from 'web3-types';

@Injectable()
export class NativeContractService implements NativeInterface {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  constructor(
    private readonly web3: EthereumWeb3Service,
    private readonly token: Token,
  ) {}

  public async createWallet(): Promise<Web3Account> {
    return this.web3.eth.accounts.create();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const gasPrice = await this.web3.eth.getGasPrice();

    const transactionConfig: Transaction = {
      value: String(amount),
      to,
      from,
    };

    const gas = await this.web3.eth
      .estimateGas(transactionConfig)
      .catch((e) => {
        this.logger.log(
          new BaseException(
            {
              message: 'Estimate fee catch',
              statusCode: WebErrorsEnum.INTERNAL_ERROR,
            },
            e,
          ),
        );

        return utils.toWei(utils.toBigInt(5), 'gwei').toString();
      });

    const feeAmount = BigInt(utils.toBigInt(gas) * utils.toBigInt(gasPrice));

    return {
      amount: feeAmount,
      decimals: this.token.decimals,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const balance = await this.web3.eth.getBalance(address);

    return {
      amount: BigInt(balance),
      decimals: this.token.decimals,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction = await this.web3.eth.getTransaction(id);
    const currentBlock = await this.web3.eth.getBlockNumber();

    const confirmations = !transaction.blockNumber
      ? 0
      : currentBlock - BigInt(transaction.blockNumber);

    return {
      amount: BigInt(transaction.value),
      to: transaction.to as string,
      transactionId: transaction.hash,
      from: transaction.from,
      confirmations: Number(confirmations),
      isConfirmed: confirmations >= 20,
    };
  }

  public async transfer(
    fromPrivateKey: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const account =
      await this.web3.eth.accounts.privateKeyToAccount(fromPrivateKey);

    this.web3.eth.accounts.wallet.add(account.privateKey);

    const transactionConfig: Transaction = {
      value: String(amount),
      to,
      from: account.address,
    };

    const receipt = await this.web3.eth.sendTransaction({
      ...transactionConfig,
      gasPrice: await this.web3.eth.getGasPrice(),
      gas: await this.web3.eth.estimateGas(transactionConfig),
    });

    return receipt.transactionHash.toString();
  }
}
