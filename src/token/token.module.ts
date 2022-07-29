import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from '@app/env/env.module';
import { LocalEnvService } from '@app/env/services/local-env.service';
import { TokenService } from '@app/auth/services/token.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [LocalEnvService],
      useFactory: (env: LocalEnvService) => env.getJwtOptions(),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
