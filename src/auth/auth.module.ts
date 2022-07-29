import { Module } from '@nestjs/common';
import { AuthController } from '@app/auth/controller/auth.controller';
import { AuthService } from '@app/auth/services/auth.service';
import { Web3AuthService } from '@app/auth/services/web3-auth.service';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { EthereumModule } from '@app/ethereum/ethereum.module';
import { TokenModule } from '@app/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthUser]), EthereumModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, Web3AuthService, AuthUserPgRepository],
})
export class AuthModule {}
