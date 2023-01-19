import TronWeb, {
  TRC20Contract,
  TriggerSmartContractType,
  TronAccount,
} from 'tronweb';
import { Token } from '@app/token/dao/entity/token';
import { TRC20Interface } from '@app/tron/interfaces/trc20.interface';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { BigNumber } from 'ethers';
import { base58Address } from '@app/utils';
import { ParameterService } from '@app/tron/services/parameter.service';

export class Trc20ContractService implements TRC20Interface {
  private readonly contract: Promise<TRC20Contract>;
  private readonly parameterService: ParameterService = new ParameterService();

  constructor(
    private readonly tronWeb: TronWeb,
    private readonly token: Token,
  ) {
    this.contract = this.tronWeb.contract().at(this.token.contractAddress);
  }

  public createWallet(): Promise<TronAccount> {
    return this.tronWeb.createAccount();
  }

  public async estimateFee(): Promise<Balance> {
    // TODO use pb for calculation fee
    return {
      amount: BigInt(264000),
      decimals: 6,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = BigInt(
      await this.contract.then((contract) =>
        contract.balanceOf(address).call({
          from: address,
        }),
      ),
    );

    return {
      amount,
      decimals: this.token.decimals,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction =
      await this.tronWeb.trx.getTransaction<TriggerSmartContractType>(id);

    const transactionInfo =
      await this.tronWeb.trx.getUnconfirmedTransactionInfo(id);
    const currentBlock = await this.tronWeb.trx.getCurrentBlock();
    const confirmations =
      currentBlock.block_header.raw_data.number - transactionInfo.blockNumber;

    const [{ parameter }] = transaction.raw_data.contract;

    const [hexRecipient, amountBn] = await this.parameterService.decode<
      [string, BigNumber]
    >(['address', 'uint256'], parameter.value.data);

    return {
      transactionId: transaction.txID,
      to: base58Address(hexRecipient),
      amount: BigInt(amountBn.toString()),
      from: base58Address(parameter.value.owner_address),
      confirmations,
    };
  }

  public async transfer(
    fromPrivateKey: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const transferMethod = await this.contract.then((contract) =>
      contract.transfer(to, Number(amount)),
    );

    return await transferMethod.send(
      {
        keepTxID: true,
      },
      fromPrivateKey,
    );
  }
}
