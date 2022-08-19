import { Module } from '@nestjs/common';
import { BalanceModule } from '@app/balance/balance.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { VirtualTransactionService } from '@app/virtual-transaction/services/virtual-transaction.service';
import { VirtualTransactionPgRepository } from '@app/virtual-transaction/repositories/virtual-transaction-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualTransaction } from '@app/virtual-transaction/dao/entity/virtual-transaction';

@Module({
  imports: [
    BalanceModule,
    WalletModule,
    TypeOrmModule.forFeature([VirtualTransaction]),
  ],
  providers: [VirtualTransactionService, VirtualTransactionPgRepository],
  exports: [VirtualTransactionService],
})
export class VirtualTransactionModule {}
