import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { BitcoinModule } from './bitcoin/bitcoin.module';
import { BitcoinRpcClient } from './bitcoin/rpc/bitcoin-rpc.client';

@Module({
  imports: [BitcoinModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly bitcoinRpcClient: BitcoinRpcClient) {}

  async onApplicationBootstrap(): Promise<void> {}
}
