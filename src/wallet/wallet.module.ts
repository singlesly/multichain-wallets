import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './dao/entity/wallet';
import { CreateWalletService } from './services/create-wallet.service';
import { TemporaryWalletPgRepository } from './repositories/temporary-wallet-pg.repository';
import { WalletController } from './controller/wallet.controller';
import { EncryptModule } from '../encrypt/encrypt.module';
import { GetWalletService } from './services/get-wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), EncryptModule],
  controllers: [WalletController],
  providers: [
    CreateWalletService,
    TemporaryWalletPgRepository,
    GetWalletService,
  ],
  exports: [GetWalletService, CreateWalletService],
})
export class WalletModule {}
