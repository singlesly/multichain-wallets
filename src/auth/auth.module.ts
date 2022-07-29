import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/controller/auth.controller';
import { AuthService } from '@app/auth/services/auth.service';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from '@app/env/env.module';
import { LocalEnvService } from '@app/env/services/local-env.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [LocalEnvService],
      useFactory: (env: LocalEnvService) => env.getJwtOptions(),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Web3AuthService, AuthUserPgRepository],
})
export class AuthModule {}
