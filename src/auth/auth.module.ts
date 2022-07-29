import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/controller/auth.controller';
import { AuthService } from '@app/auth/services/auth.service';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '@app/auth/services/token.service';
import { EthereumModule } from '@app/ethereum/ethereum.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthUser]), EthereumModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, Web3AuthService, AuthUserPgRepository, TokenService],
  exports: [TokenService],
})
export class AuthModule {}
