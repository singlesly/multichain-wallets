import { Module } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { DatabaseModule } from './database/database.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { TemporaryWalletModule } from './temporary-wallet/temporary-wallet.module';
import { RouterModule } from '@nestjs/core';
import { RequestContextModule } from '@ledius/request-context';
import { LoggerModule } from '@ledius/logger';
import { HealthModule } from './health/health.module';
import { routes } from './routes';

@Module({
  imports: [
    BitcoinModule,
    DatabaseModule,
    EncryptModule,
    TemporaryWalletModule,
    RequestContextModule,
    LoggerModule,
    HealthModule,
    RouterModule.register(routes),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
