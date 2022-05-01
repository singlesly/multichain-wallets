import { Inject, Injectable } from '@nestjs/common';
import TronWeb, { TRC20Contract } from 'tronweb';
import { TRC20 } from '@app/tron/interfaces/trc20';
import {
  USDT_CONTRACT,
  USDT_CONTRACT_ADDRESS,
} from '@app/usdt-trc20/constants';

@Injectable()
export class USDTClientService implements TRC20 {
  constructor(
    private readonly tronWeb: TronWeb,
    @Inject(USDT_CONTRACT) private readonly usdtContract: TRC20Contract,
  ) {}

  public async balanceOf(address: string): Promise<bigint> {
    return BigInt(await this.usdtContract.balanceOf(address).call());
  }

  public async totalSupply(): Promise<bigint> {
    return BigInt(await this.usdtContract.totalSupply().call());
  }

  public async transfer(
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<boolean> {
    const { transaction } =
      await this.tronWeb.transactionBuilder.triggerSmartContract(
        USDT_CONTRACT_ADDRESS,
        'transfer(address, uint256)',
        {},
        [
          { type: 'address', value: to },
          { type: 'uint256', value: Number(amount) },
        ],
      );

    const signedTransaction = await this.tronWeb.trx.sign(
      transaction,
      privateKey,
    );

    await this.tronWeb.trx.sendRawTransaction(signedTransaction);

    return true;
  }
}
