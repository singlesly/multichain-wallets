import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TemporaryWalletModule } from './temporary-wallet/temporary-wallet.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    BitcoinModule,
    DatabaseModule,
    EncryptModule,
    TemporaryWalletModule,
    RouterModule.register([
      {
        path: '/api/bridge',
        module: TemporaryWalletModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
