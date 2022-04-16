import { Module } from '@nestjs/common';
import { TemporaryWalletServiceFactory } from './factories/temporary-wallet-service.factory';
import { BitcoinModule } from '../bitcoin/bitcoin.module';

@Module({
  imports: [BitcoinModule],
  providers: [TemporaryWalletServiceFactory],
})
export class TemporaryWalletModule {}
