import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database/database.module';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { RequestContextModule } from '@ledius/request-context';
import { LoggerModule } from '@ledius/logger';
import { routes } from '@app/routes';
import { BridgeModule } from '@app/bridge/bridge.module';
import { BaseExceptionFilter } from '@app/common/filters/base-exception.filter';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';

@Module({
  imports: [
    BridgeModule,
    DatabaseModule,
    EncryptModule,
    LoggerModule,
    NetworkModule,
    RequestContextModule,
    RouterModule.register(routes),
    TokenModule,
    WalletBalanceModule,
    WalletModule,
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
  ],
})
export class AppModule {}
