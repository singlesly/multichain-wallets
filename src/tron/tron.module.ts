import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';
import { TronWeb3Service } from './services/tron-web3.service';
import { TronClientService } from './services/tron-client.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@ledius/logger';
import { RequestContextModule } from '@ledius/request-context';
import { HttpClientLoggingInterceptor } from '../common/interceptors/http-client-logging.interceptor';

@Module({
  imports: [
    EnvModule,
    HttpModule.registerAsync({
      imports: [EnvModule],
      inject: [LocalEnvService],
      useFactory: (env: LocalEnvService) => ({
        baseURL: env.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL),
      }),
    }),
    LoggerModule,
    RequestContextModule,
  ],
  providers: [
    HttpClientLoggingInterceptor,
    {
      provide: TronWeb3Service,
      useFactory: (env: LocalEnvService): TronWeb3Service =>
        new TronWeb3Service(env.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL)),
      inject: [LocalEnvService],
    },
    TronClientService,
  ],
  exports: [TronWeb3Service, TronClientService],
})
export class TronModule {}
