import { Module } from '@nestjs/common';
import { VirtualBalancePgRepository } from '@app/virtual-balance/repositories/virtual-balance-pg.repository';
import { VirtualBalanceService } from '@app/virtual-balance/services/virtual-balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualBalance } from '@app/virtual-balance/dao/entity/virtual-balance';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualBalance])],
  providers: [VirtualBalancePgRepository, VirtualBalanceService],
  exports: [VirtualBalanceService],
})
export class VirtualBalanceModule {}
