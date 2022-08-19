import { Injectable } from '@nestjs/common';
import { BitcoinRpcClient } from '@app/bitcoin/rpc/bitcoin-rpc.client';
import {
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { LoggerService } from '@ledius/logger';
import { VirtualBalanceService } from '@app/virtual-balance/services/virtual-balance.service';
import { FeatureService } from '@ledius/feature/dist/services/feature.service';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { VirtualTransactionService } from '@app/virtual-transaction/services/virtual-transaction.service';

@Injectable()
export class BitcoinAgentService implements AgentService {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly createTemporaryWalletService: CreateWalletService,
    private readonly getTemporaryWalletService: GetWalletService,
    private readonly logger: LoggerService,
    private readonly virtualBalanceService: VirtualBalanceService,
    private readonly virtualTransactionService: VirtualTransactionService,
    private readonly features: FeatureService,
  ) {}

  public async createWallet(owners: string[] = []): Promise<Wallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();

    return await this.createTemporaryWalletService.create({
      pubKey: address,
      privateKey: '',
      owners,
      network: NetworkEnum.BTC,
      coin: CoinEnum.BTC,
    });
  }

  public async getBalance(address: string): Promise<Balance> {
    const wallet = await this.getTemporaryWalletService.getByAddress(address);
    const unspents = await this.bitcoinRpcClient.listUnspent(address, 3);
    const virtualBalance = await this.virtualBalanceService.getBalance(
      wallet.id,
      wallet.network,
      wallet.coin,
    );

    const virtualAmount = this.features.isOn(
      LocalEnvPathEnum.FEATURE_VIRTUAL_BALANCES,
    )
      ? virtualBalance.balance
      : BigInt(0);

    const balance = unspents.reduce(
      (total, unspent) => total + unspent.amount,
      BigInt(0),
    );

    return {
      amount: balance + virtualAmount,
      decimals: 8,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);
    const internalRecipient =
      await this.getTemporaryWalletService.findByAddress(to);

    if (internalRecipient) {
      const transaction = await this.virtualTransactionService.submit(
        {
          from,
          to,
          amount,
        },
        NetworkEnum.BTC,
        CoinEnum.BTC,
      );

      return transaction.id;
    }

    const unspents = await this.bitcoinRpcClient.listUnspent(wallet.pubKey, 3);

    if (unspents.length <= 0) {
      throw new BaseException({
        statusCode: WebErrorsEnum.INSUFFICIENT_FUNDS,
        message: 'Insufficient funds',
      });
    }

    this.logger.log(unspents);

    const transactionHash = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
      unspents,
    );

    const fundedTransactionHash =
      await this.bitcoinRpcClient.fundRawTransaction(transactionHash, {
        add_inputs: false,
        changeAddress: wallet.pubKey,
        changePosition: 0,
        includeWatching: true,
      });

    const signedTransactionHex =
      await this.bitcoinRpcClient.signRawTransactionWithWallet(
        fundedTransactionHash,
      );

    return await this.bitcoinRpcClient.sendRawTransaction(signedTransactionHex);
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const transactionHash = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
    );

    const fundedTransactionHash =
      await this.bitcoinRpcClient.fundRawTransaction(transactionHash, {
        add_inputs: true,
        changeAddress: from,
        changePosition: 0,
        includeWatching: true,
      });

    const decodedFundedTransaction =
      await this.bitcoinRpcClient.decodeRawTransaction(fundedTransactionHash);

    const fee = await this.bitcoinRpcClient.estimateSmartFee();

    return {
      amount: BigInt(decodedFundedTransaction.vsize.toFixed(0)) * fee,
      decimals: 8,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const virtualTransaction = await this.virtualTransactionService.getById(id);
    if (virtualTransaction) {
      return {
        transactionId: virtualTransaction.id,
        amount: virtualTransaction.amount,
        to: virtualTransaction.to,
        from: virtualTransaction.from,
        confirmations: 1000,
      };
    }

    const transaction = await this.bitcoinRpcClient.getRawTransaction(id);

    const firstAddress = transaction.vout[0]?.scriptPubKey.address || '';
    const lastAddress =
      transaction.vout[transaction.vout.length - 1]?.scriptPubKey.address ?? '';

    const amount = Number(
      transaction.vout[transaction.vout.length - 1].value * 10 ** 8,
    ).toFixed(0);

    return {
      transactionId: transaction.txid,
      confirmations: transaction.confirmations,
      amount: BigInt(amount),
      to: firstAddress,
      from: lastAddress,
    };
  }
}
