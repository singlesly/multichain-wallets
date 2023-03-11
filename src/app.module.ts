import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database/database.module';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { RequestContextModule } from '@ledius/request-context';
import { LoggerModule } from '@ledius/logger';
import { routes } from '@app/routes';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { ApplicationModule } from '@app/application/application.module';
import { BridgeModule } from '@app/bridge/bridge.module';
import { BaseExceptionFilter } from '@app/common/filters/base-exception.filter';
import { AuthModule } from '@app/auth/auth.module';
import { JwtModule } from '@app/jwt/jwt.module';
import { FeatureModule } from '@ledius/feature/dist/feature.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { PaymentModule } from '@app/payment/payment.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';
import { BullModule } from '@nestjs/bull';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { ConverterModule } from '@app/converter/converter.module';
import { OfferModule } from '@app/offer/offer.module';
import { OfferHistoryModule } from '@app/offer-history/offer-history.module';

@Module({
  imports: [
    ApplicationModule,
    AuthModule,
    BridgeModule,
    ConverterModule,
    DatabaseModule,
    EncryptModule,
    LoggerModule,
    NetworkModule,
    OfferHistoryModule,
    OfferModule,
    PaymentModule,
    RequestContextModule,
    RouterModule.register(routes),
    TokenModule,
    WalletBalanceModule,
    WalletModule,
    ServeStaticModule.forRoot(
      {
        rootPath: path.join(__dirname, '..', 'public'),
        serveRoot: '/api/public',
      },
      {
        rootPath: path.join(__dirname, '..', 'public', 'ui', 'build'),
        serveRoot: '/',
      },
    ),
    JwtModule,
    FeatureModule.forRoot(),
    BullModule.forRootAsync({
      imports: [LocalEnvModule],
      useFactory: (env: EnvProviderService) => ({
        redis: {
          db: 1,
          host: env.getOrFail(LocalEnvPathEnum.REDIS_HOST),
          port: +env.getOrFail(LocalEnvPathEnum.REDIS_PORT),
        },
      }),
      inject: [EnvProviderService],
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
  ],
})
export class AppModule {}
