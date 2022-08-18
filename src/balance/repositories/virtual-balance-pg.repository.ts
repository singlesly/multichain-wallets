import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VirtualBalance } from '@app/balance/dao/entity/virtual-balance';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';

@Injectable()
export class VirtualBalancePgRepository {
  constructor(
    @InjectRepository(VirtualBalance)
    private readonly repository: Repository<VirtualBalance>,
  ) {}

  public async findByWalletIdOrCreate(
    walletId: string,
    network: NetworkEnum,
    coin: CoinEnum,
  ): Promise<VirtualBalance> {
    const virtualBalance = await this.repository.findOne({
      where: {
        walletId,
        network,
        coin,
      },
    });

    if (virtualBalance) {
      return virtualBalance;
    }

    return await this.repository.save(
      new VirtualBalance(walletId, BigInt(0), network, coin),
    );
  }

  public async save(virtualBalance: VirtualBalance): Promise<VirtualBalance> {
    return this.repository.save(virtualBalance);
  }
}
