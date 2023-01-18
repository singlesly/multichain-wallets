import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { LocalEnvService } from '@app/local-env/services/local-env.service';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [LocalEnvModule],
      inject: [LocalEnvService],
      useFactory: (env: LocalEnvService) => env.getJwtOptions(),
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
