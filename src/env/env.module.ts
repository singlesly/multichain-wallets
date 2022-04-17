import { Module } from '@nestjs/common';
import { EnvProviderService } from './services/env-provider.service';
import { LocalEnvService } from './services/local-env.service';

@Module({
  providers: [EnvProviderService, LocalEnvService],
  exports: [LocalEnvService],
})
export class EnvModule {}
