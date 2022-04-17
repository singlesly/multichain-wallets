import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TemporaryWalletModule } from './temporary-wallet/temporary-wallet.module';

@Module({
  imports: [
    BitcoinModule,
    DatabaseModule,
    EncryptModule,
    TemporaryWalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
