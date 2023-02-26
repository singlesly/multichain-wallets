import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { HttpEpayService } from '@app/http-epay/services/http-epay.service';

@Module({
  imports: [
    LocalEnvModule,
    HttpModule.registerAsync({
      imports: [LocalEnvModule],
      useFactory: (env: EnvProviderService) => ({
        baseURL: env.getOrFail(LocalEnvPathEnum.EPAY_BASE_URL),
      }),
      inject: [EnvProviderService],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useFactory: (env: EnvProviderService) =>
        env.getOrFail(LocalEnvPathEnum.EPAY_API_KEY),
      inject: [EnvProviderService],
    },
    HttpEpayService,
  ],
  exports: [HttpEpayService],
})
export class HttpEpayModule {}
