import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EncryptService } from './services/encrypt.service';

@Module({
  imports: [EnvModule],
  providers: [EncryptService],
  exports: [EncryptService],
})
export class EncryptModule {}
