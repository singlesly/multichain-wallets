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
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ApplicationModule,
    BitcoinModule,
    DatabaseModule,
    EncryptModule,
    TemporaryWalletModule,
    RequestContextModule,
    LoggerModule,
    HealthModule,
    RouterModule.register(routes),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
