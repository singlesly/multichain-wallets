import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { EnvProviderService } from '@ledius/env';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';
import { TinkoffService } from '@app/tinkoff/services/tinkoff.service';

@Module({
  imports: [
    LocalEnvModule,
    HttpModule.registerAsync({
      imports: [LocalEnvModule],
      inject: [EnvProviderService],
      useFactory: (env: EnvProviderService) => ({
        baseURL: env.getOrFail(LocalEnvPathEnum.TINKOFF_ACQUIRING_BASE_URL),
      }),
    }),
  ],
  providers: [TinkoffService],
  exports: [TinkoffService],
})
export class TinkoffModule {}
