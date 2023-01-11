import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './dao/entity/wallet';
import { CreateWalletService } from './services/create-wallet.service';
import { WalletPgRepository } from './repositories/wallet-pg.repository';
import { WalletController } from './controller/wallet.controller';
import { EncryptModule } from '../encrypt/encrypt.module';
import { GetWalletService } from './services/get-wallet.service';
import { WalletCommand } from '@app/wallet/cli/wallet.command';
import { ExportWalletCommand } from '@app/wallet/cli/export-wallet.command';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), EncryptModule],
  controllers: [WalletController],
  providers: [
    CreateWalletService,
    WalletPgRepository,
    GetWalletService,
    WalletCommand,
    ExportWalletCommand,
  ],
  exports: [GetWalletService, CreateWalletService],
})
export class WalletModule {}
