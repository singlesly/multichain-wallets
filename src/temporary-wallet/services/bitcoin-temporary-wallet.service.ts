import { Injectable, NotImplementedException } from '@nestjs/common';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import { Balance, AgentService, Wallet } from '../agent.service';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';

@Injectable()
export class BitcoinTemporaryWalletService implements AgentService {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(): Promise<TemporaryWallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();
    const privateKey = await this.bitcoinRpcClient.dumpPrivateKey(address);

    return await this.createTemporaryWalletService.create({
      pubKey: address,
      privateKey: privateKey,
      network: NetworkEnum.BTC,
      coin: CoinEnum.BTC,
    });
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.bitcoinRpcClient.getReceivedByAddress(address, 3);

    return {
      amount,
      decimals: 8,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<void> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);

    const transactionHash = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
    );

    const fundedTransactionHash =
      await this.bitcoinRpcClient.fundRawTransaction(transactionHash, {
        changeAddress: wallet.pubKey,
        changePosition: 0,
        includeWatching: true,
      });

    const signedTransactionHex =
      await this.bitcoinRpcClient.signRawTransactionWithWallet(
        fundedTransactionHash,
      );

    const tx = await this.bitcoinRpcClient.sendRawTransaction(
      signedTransactionHex,
    );

    return tx as never;
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
}
