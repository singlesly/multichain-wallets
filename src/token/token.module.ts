import { Module } from '@nestjs/common';
import { NetworkModule } from '@app/network/network.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@app/token/dao/entity/token';
import { TokenService } from '@app/token/services/token.service';
import { TokenController } from '@app/token/controllers/token.controller';

@Module({
  imports: [NetworkModule, TypeOrmModule.forFeature([Token])],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
