import { Module } from '@nestjs/common';
import { TemporaryWalletServiceFactory } from './factories/temporary-wallet-service.factory';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryWallet } from './dao/entity/temporary-wallet';

@Module({
  imports: [BitcoinModule, TypeOrmModule.forFeature([TemporaryWallet])],
  providers: [TemporaryWalletServiceFactory],
})
export class TemporaryWalletModule {}
