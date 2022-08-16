import { Module } from '@nestjs/common';
import { LocalEnvModule } from '../local-env/local-env.module';
import { EncryptService } from './services/encrypt.service';

@Module({
  imports: [LocalEnvModule],
  providers: [EncryptService],
  exports: [EncryptService],
})
export class EncryptModule {}
