import { Module } from '@nestjs/common';
import { NetworkController } from '@app/network/controllers/network.controller';
import { NetworkService } from '@app/network/services/network.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Network } from '@app/network/dao/entity/network';

@Module({
  imports: [TypeOrmModule.forFeature([Network])],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
