import TronWeb, {
  Address,
  TRC20Contract,
  TriggerSmartContractType,
  TronAccount,
  Uint256,
} from 'tronweb';
import { Token } from '@app/token/dao/entity/token';
import { TRC20Interface } from '@app/tron/interfaces/trc20.interface';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { BigNumber } from 'ethers';
import { base58Address } from '@app/utils';
import { ParameterService } from '@app/tron/services/parameter.service';
import { ForbiddenException } from '@nestjs/common';

export class Trc20ContractService implements TRC20Interface {
  private readonly contract: Promise<TRC20Contract>;
  private readonly parameterService: ParameterService = new ParameterService();

  constructor(
    private readonly tronWeb: TronWeb,
    private readonly token: Token,
  ) {
    if (!this.token.contractAddress) {
      throw new ForbiddenException('Contract address not provided');
    }
    this.contract = this.tronWeb.contract().at(this.token.contractAddress);
  }

  public createWallet(): Promise<TronAccount> {
    return this.tronWeb.createAccount();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<Balance> {
    const parameter = [
      { type: 'address', value: to },
      { type: 'uint256', value: Number(amount) },
    ] as [{ type: Address; value: string }, { type: Uint256; value: number }];
    const transaction =
      await this.tronWeb.transactionBuilder.triggerSmartContract(
        this.token.contractAddress as string,
        'transfer(address,uint256)',
        {},
        parameter,
        from,
      );

    const signedTransaction = await this.tronWeb.trx.sign(
      transaction.transaction,
      privateKey,
    );

    let howManyNeed = transaction.transaction.raw_data_hex.length;
    for (const sign of signedTransaction.signature) {
      howManyNeed += sign.length;
    }
    howManyNeed = Math.ceil(howManyNeed / 2) + 69;

    const { energy_required } =
      await this.tronWeb.transactionBuilder.estimateEnergy(
        this.token.contractAddress as string,
        'transfer(address,uint256)',
        {},
        parameter,
        from,
      );
    const energyNeed = BigInt(energy_required * 420);

    return {
      decimals: this.token.decimals,
      amount: BigInt(howManyNeed * 1_000) + energyNeed,
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
