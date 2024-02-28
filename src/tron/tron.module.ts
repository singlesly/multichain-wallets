import { Module } from '@nestjs/common';
import { LocalEnvModule } from '../local-env/local-env.module';
import { LoggerModule } from '@ledius/logger';
import { RequestContextModule } from '@ledius/request-context';
import { ParameterService } from '@app/tron/services/parameter.service';
import { TronCompatibleFactory } from '@app/tron/services/tron-compatible.factory';

@Module({
  imports: [LocalEnvModule, LoggerModule, RequestContextModule],
  providers: [ParameterService, TronCompatibleFactory],
  exports: [ParameterService, TronCompatibleFactory],
})
export class TronModule {}
