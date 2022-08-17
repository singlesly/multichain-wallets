import { Module } from '@nestjs/common';
import { VirtualBalancePgRepository } from '@app/balance/repositories/virtual-balance-pg.repository';
import { VirtualBalanceService } from '@app/balance/services/virtual-balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualBalance } from '@app/balance/dao/entity/virtual-balance';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualBalance])],
  providers: [VirtualBalancePgRepository, VirtualBalanceService],
  exports: [VirtualBalanceService],
})
export class BalanceModule {}
