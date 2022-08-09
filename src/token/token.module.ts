import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { LocalEnvService } from '@app/local-env/services/local-env.service';
import { TokenService } from '@app/token/token.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [LocalEnvModule],
      inject: [LocalEnvService],
      useFactory: (env: LocalEnvService) => env.getJwtOptions(),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
