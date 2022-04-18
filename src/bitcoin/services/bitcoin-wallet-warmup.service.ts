import { Injectable } from '@nestjs/common';
import { LoggerService } from '@ledius/logger';
import { BitcoinRpcClient } from '../rpc/bitcoin-rpc.client';
import { MAIN_WALLET } from '../constants';

@Injectable()
export class BitcoinWalletWarmupService {
  constructor(
    private readonly logger: LoggerService,
    private readonly bitcoinRpcClient: BitcoinRpcClient,
  ) {}

  public async warmup(): Promise<void> {
    try {
      await this.bitcoinRpcClient.createWallet(MAIN_WALLET);
      this.logger.log('Main wallet created');
    } catch (e) {
      this.logger.log(e);
      try {
        await this.bitcoinRpcClient.loadWallet(MAIN_WALLET);
        this.logger.log('Main wallet loaded');
      } catch (e) {
        this.logger.log(e);
      }
    } finally {
    }
  }
}
