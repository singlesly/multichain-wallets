import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/controller/auth.controller';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { EthereumModule } from '@app/ethereum/ethereum.module';
import { JwtModule } from '@app/jwt/jwt.module';
import { LoggerModule } from '@ledius/logger';
import { DefaultAdminUserService } from '@app/auth/services/default-admin-user.service';
import { LocalEnvModule } from '@app/local-env/local-env.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    EthereumModule,
    JwtModule,
    LoggerModule,
    LocalEnvModule,
  ],
  controllers: [AuthController],
  providers: [Web3AuthService, AuthUserPgRepository, DefaultAdminUserService],
  exports: [AuthUserPgRepository],
})
export class AuthModule {}
