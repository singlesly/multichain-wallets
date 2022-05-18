import { Inject, Injectable } from '@nestjs/common';
import TronWeb, { TRC20Contract } from 'tronweb';
import { TRC20 } from '@app/tron/interfaces/trc20';
import { USDT_CONTRACT } from '@app/usdt-trc20/constants';
import { LocalEnvService } from '@app/env/services/local-env.service';

@Injectable()
export class USDTClientService implements TRC20 {
  constructor(
    private readonly tronWeb: TronWeb,
    @Inject(USDT_CONTRACT) private readonly usdtContract: TRC20Contract,
    private readonly localEnvService: LocalEnvService,
  ) {}

  public async getDecimals(): Promise<number> {
    return 6;
  }

  public async balanceOf(address: string): Promise<bigint> {
    return BigInt(
      await this.usdtContract.balanceOf(address).call({
        from: address,
      }),
    );
  }

  public async totalSupply(): Promise<bigint> {
    return BigInt(
      await this.usdtContract.totalSupply().call({
        from: this.localEnvService.getUsdtContractAddress(),
      }),
    );
  }

  public async transfer(
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<string> {
    const transferMethod = this.usdtContract.transfer(to, Number(amount));

    return transferMethod.send(
      {
        keepTxID: true,
      },
      privateKey,
    );
  }
}
