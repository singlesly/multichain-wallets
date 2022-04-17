import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { BitcoinRpcClient } from './bitcoin/rpc/bitcoin-rpc.client';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [BitcoinModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly bitcoinRpcClient: BitcoinRpcClient) {}

  async onApplicationBootstrap(): Promise<void> {}
}
