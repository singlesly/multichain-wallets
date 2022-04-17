import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BitcoinRpcClient } from './rpc/bitcoin-rpc.client';
import { EnvModule } from '../env/env.module';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [EnvModule],
      useFactory: (env: LocalEnvService) => {
        return {
          auth: {
            username: env.getSafety(LocalEnvPathEnum.BTC_RPC_AUTH_USERNAME),
            password: env.getSafety(LocalEnvPathEnum.BTC_RPC_AUTH_PASSWORD),
          },
          baseURL: env.getSafety(LocalEnvPathEnum.BTC_RPC_BASE_URL),
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      },
      inject: [LocalEnvService],
    }),
  ],
  providers: [BitcoinRpcClient],
  exports: [BitcoinRpcClient],
})
export class BitcoinModule implements OnModuleInit {
  constructor(
    private readonly http: HttpService,
    private readonly bitcoinRpcClient: BitcoinRpcClient,
  ) {
    this.http.axiosRef.interceptors.response.use(null, (err) => {
      console.log('Bitcoin Rpc Error');
      if (err.response?.data) {
        console.error(err.response?.data);
      } else {
        console.log(err);
        console.log(err.response);
      }
      throw err;
    });
  }

  public async onModuleInit(): Promise<void> {
    try {
      await this.bitcoinRpcClient.createWallet('main');
    } catch (e) {
      try {
        await this.bitcoinRpcClient.loadWallet('main');
      } catch (e) {}
    } finally {
      console.log('Loaded main wallet');
    }
  }
}
