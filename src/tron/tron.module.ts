import { Module } from '@nestjs/common';
import { LocalEnvModule } from '../local-env/local-env.module';
import { LocalEnvService } from '../local-env/services/local-env.service';
import { LocalEnvPathEnum } from '../local-env/contants/local-env-path.enum';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@ledius/logger';
import { RequestContextModule } from '@ledius/request-context';
import { HttpClientLoggingInterceptor } from '../common/interceptors/http-client-logging.interceptor';
import { ParameterService } from '@app/tron/services/parameter.service';
import TronWeb from 'tronweb';

@Module({
  imports: [
    LocalEnvModule,
    HttpModule.registerAsync({
      imports: [LocalEnvModule],
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
    ParameterService,
    {
      provide: TronWeb,
      useFactory: (env: LocalEnvService) => {
        return new TronWeb({
          fullHost: env.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL),
          solidityNode: env.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL),
          headers: {
            'TRON-PRO-API-KEY': env.getSafety(
              LocalEnvPathEnum.TRON_RPC_PRO_API_KEY,
            ),
          },
        });
      },
      inject: [LocalEnvService],
    },
  ],
  exports: [ParameterService, TronWeb],
})
export class TronModule {}
