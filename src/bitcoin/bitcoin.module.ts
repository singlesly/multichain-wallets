import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BitcoinRpcClient } from './rpc/bitcoin-rpc.client';
import { EnvModule } from '../env/env.module';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';
import { LoggerModule } from '@ledius/logger';
import { BitcoinWalletWarmupService } from './services/bitcoin-wallet-warmup.service';
import { RequestContextModule } from '@ledius/request-context';
import { BtcCommand } from './cli/btc.command';
import { UptimeCommand } from './cli/uptime.command';
import { HttpClientLoggingInterceptor } from '../common/interceptors/http-client-logging.interceptor';

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
    LoggerModule,
    RequestContextModule,
  ],
  providers: [
    BitcoinRpcClient,
    BitcoinWalletWarmupService,
    HttpClientLoggingInterceptor,
    BtcCommand,
    UptimeCommand,
  ],
  exports: [BitcoinRpcClient],
})
export class BitcoinModule implements OnModuleInit {
  constructor(
    private readonly bitcoinWalletWarmupService: BitcoinWalletWarmupService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.bitcoinWalletWarmupService.warmup();
  }
}
