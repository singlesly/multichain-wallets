import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TemporaryWalletModule } from './temporary-wallet/temporary-wallet.module';
import { RouterModule } from '@nestjs/core';
import { RequestContextModule } from '@ledius/request-context';
import { LoggerModule } from '@ledius/logger';

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
    RequestContextModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
