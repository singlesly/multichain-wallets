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
import { EthereumModule } from '../ethereum/ethereum.module';
import { EthereumTemporaryWalletService } from './services/ethereum-temporary-wallet.service';
import { EncryptModule } from '../encrypt/encrypt.module';

@Module({
  imports: [
    BitcoinModule,
    EthereumModule,
    TypeOrmModule.forFeature([TemporaryWallet]),
    EncryptModule,
  ],
  controllers: [BridgeController, WalletController],
  providers: [
    TemporaryWalletServiceFactory,
    BitcoinTemporaryWalletService,
    EthereumTemporaryWalletService,
    CreateTemporaryWalletService,
    TemporaryWalletPgRepository,
  ],
})
export class TemporaryWalletModule {}
