import { Injectable } from '@nestjs/common';
import {
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import TronWeb, {
  TransferContractType,
  TriggerSmartContractType,
} from 'tronweb';
import { base58Address } from '@app/utils';
import { ParameterService } from '@app/tron/services/parameter.service';
import { BigNumber } from 'ethers';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class UsdtTrc20AgentService implements AgentService {
  constructor(
    private readonly tronWeb: TronWeb,
    private readonly usdtClientService: USDTClientService,
    private readonly getWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
    private readonly parameterService: ParameterService,
  ) {}

  public async createWallet(): Promise<Wallet> {
    throw new BaseException({
      statusCode: WebErrorsEnum.PERMISSION_DENIED,
      message:
        'USDT is a TRC20 token you should use network TRON and coin TRON for create USDT Wallet',
    });
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    return Promise.resolve(undefined);
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.usdtClientService.balanceOf(address);

    return {
      decimals: await this.usdtClientService.getDecimals(),
      amount,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const [transaction, transactionInfo, currentBlock] = await Promise.all([
      this.tronWeb.trx.getTransaction<TriggerSmartContractType>(id),
      this.tronWeb.trx.getTransactionInfo(id),
      this.tronWeb.trx.getCurrentBlock(),
    ]);

    const [{ parameter }] = transaction.raw_data.contract;

    const [hexRecipient, amountBn] = await this.parameterService.decode<
      [string, BigNumber]
    >(['address', 'uint256'], parameter.value.data);

    const confirmations = () => {
      if (!transactionInfo.blockNumber) {
        return 0;
      }

      return (
        currentBlock.block_header.raw_data.number - transactionInfo.blockNumber
      );
    };

    return {
      transactionId: transaction.txID,
      to: base58Address(hexRecipient),
      amount: BigInt(amountBn.toString()),
      from: base58Address(parameter.value.owner_address),
      confirmations: confirmations(),
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const wallet = await this.getWalletService.getByAddress(from);

    const transactionId = await this.usdtClientService.transfer(
      to,
      amount,
      await this.encryptService.decrypt(wallet.privateKey),
    );

    return transactionId;
  }
}
