import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VirtualBalance } from '@app/balance/dao/entity/virtual-balance';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VirtualBalancePgRepository {
  constructor(
    @InjectRepository(VirtualBalance)
    private readonly repository: Repository<VirtualBalance>,
  ) {}

  public async findByWalletIdOrCreate(
    walletId: string,
  ): Promise<VirtualBalance> {
    const virtualBalance = await this.repository.findOne({
      where: {
        walletId,
      },
    });

    if (virtualBalance) {
      return virtualBalance;
    }

    return await this.repository.save(new VirtualBalance(walletId, BigInt(0)));
  }

  public async save(virtualBalance: VirtualBalance): Promise<VirtualBalance> {
    return this.repository.save(virtualBalance);
  }
}
