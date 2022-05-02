import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BitcoinModule } from '@app/bitcoin/bitcoin.module';
import { DatabaseModule } from '@app/database/database.module';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { RequestContextModule } from '@ledius/request-context';
import { LoggerModule } from '@ledius/logger';
import { HealthModule } from '@app/health/health.module';
import { routes } from '@app/routes';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { ApplicationModule } from '@app/application/application.module';
import { BridgeModule } from '@app/bridge/bridge.module';
import { BaseExceptionFilter } from '@app/common/filters/base-exception.filter';
import { UnhandledExceptionFilter } from '@app/common/filters/unhandled-exception.filter';

@Module({
  imports: [
    ApplicationModule,
    BitcoinModule,
    BridgeModule,
    DatabaseModule,
    EncryptModule,
    WalletModule,
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnhandledExceptionFilter,
    },
  ],
})
export class AppModule {}
