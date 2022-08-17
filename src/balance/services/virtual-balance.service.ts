import { Injectable } from '@nestjs/common';
import { VirtualBalance } from '@app/balance/dao/entity/virtual-balance';
import { VirtualBalancePgRepository } from '@app/balance/repositories/virtual-balance-pg.repository';

@Injectable()
export class VirtualBalanceService {
  constructor(
    private readonly virtualBalancePgRepository: VirtualBalancePgRepository,
  ) {}

  public async getBalance(walletId: string): Promise<VirtualBalance> {
    return await this.virtualBalancePgRepository.findByWalletIdOrCreate(
      walletId,
    );
  }

  public async decrease(
    walletId: string,
    amount: bigint,
  ): Promise<VirtualBalance> {
    const virtualBalance =
      await this.virtualBalancePgRepository.findByWalletIdOrCreate(walletId);

    return await virtualBalance
      .decrease(amount)
      .save(this.virtualBalancePgRepository);
  }

  public async increase(
    walletId: string,
    amount: bigint,
  ): Promise<VirtualBalance> {
    const virtualBalance =
      await this.virtualBalancePgRepository.findByWalletIdOrCreate(walletId);

    return await virtualBalance
      .increase(amount)
      .save(this.virtualBalancePgRepository);
  }

  public async transfer(
    fromWalletId: string,
    toWalletId: string,
    amount: bigint,
  ): Promise<{ from: VirtualBalance; to: VirtualBalance }> {
    const [from, to] = await Promise.all([
      this.virtualBalancePgRepository.findByWalletIdOrCreate(fromWalletId),
      this.virtualBalancePgRepository.findByWalletIdOrCreate(toWalletId),
    ]);

    return {
      from: await from.decrease(amount).save(this.virtualBalancePgRepository),
      to: await to.increase(amount).save(this.virtualBalancePgRepository),
    };
  }
}
