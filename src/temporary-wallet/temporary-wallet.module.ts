import { Module } from '@nestjs/common';
import { TemporaryWalletServiceFactory } from './factories/temporary-wallet-service.factory';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryWallet } from './dao/entity/temporary-wallet';
import { BridgeController } from './controller/bridge.controller';
import { BitcoinTemporaryWalletService } from './services/bitcoin-temporary-wallet.service';
import { CreateTemporaryWalletService } from './services/create-temporary-wallet.service';
import { TemporaryWalletPgRepository } from './repositories/temporary-wallet-pg.repository';
import { WalletController } from './controller/wallet.controller';

@Module({
  imports: [BitcoinModule, TypeOrmModule.forFeature([TemporaryWallet])],
  controllers: [BridgeController, WalletController],
  providers: [
    TemporaryWalletServiceFactory,
    BitcoinTemporaryWalletService,
    CreateTemporaryWalletService,
    TemporaryWalletPgRepository,
  ],
})
export class TemporaryWalletModule {}
