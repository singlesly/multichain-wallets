import { Module } from '@nestjs/common';
import { LocalEnvService } from './services/local-env.service';
import { EnvModule } from '@ledius/env';

@Module({
  imports: [EnvModule],
  providers: [LocalEnvService],
  exports: [LocalEnvService, EnvModule],
})
export class LocalEnvModule {}
