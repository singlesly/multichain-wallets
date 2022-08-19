import { Injectable } from '@nestjs/common';
import { VirtualBalance } from '@app/virtual-balance/dao/entity/virtual-balance';
import { VirtualBalancePgRepository } from '@app/virtual-balance/repositories/virtual-balance-pg.repository';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';

@Injectable()
export class VirtualBalanceService {
  constructor(
    private readonly virtualBalancePgRepository: VirtualBalancePgRepository,
  ) {}

  public async getBalance(
    walletId: string,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<VirtualBalance> {
    return await this.virtualBalancePgRepository.findByWalletIdOrCreate(
      walletId,
      network,
      coin,
    );
  }

  public async decrease(
    walletId: string,
    amount: bigint,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<VirtualBalance> {
    const virtualBalance =
      await this.virtualBalancePgRepository.findByWalletIdOrCreate(
        walletId,
        network,
        coin,
      );

    return await virtualBalance
      .decrease(amount)
      .save(this.virtualBalancePgRepository);
  }

  public async increase(
    walletId: string,
    amount: bigint,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<VirtualBalance> {
    const virtualBalance =
      await this.virtualBalancePgRepository.findByWalletIdOrCreate(
        walletId,
        network,
        coin,
      );

    return await virtualBalance
      .increase(amount)
      .save(this.virtualBalancePgRepository);
  }

  public async transfer(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<{ from: VirtualBalance; to: VirtualBalance }> {
    const [from, to] = await Promise.all([
      this.virtualBalancePgRepository.findByWalletIdOrCreate(
        fromWalletId,
        network,
        coin,
      ),
      this.virtualBalancePgRepository.findByWalletIdOrCreate(
        toWalletId,
        network,
        coin,
      ),
    ]);

    return {
      from: await from.decrease(amount).save(this.virtualBalancePgRepository),
      to: await to.increase(amount).save(this.virtualBalancePgRepository),
    };
  }
}
