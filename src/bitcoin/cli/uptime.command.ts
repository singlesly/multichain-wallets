import { CommandRunner, SubCommand } from 'nest-commander';
import { BitcoinRpcClient } from '../rpc/bitcoin-rpc.client';
import { ConsoleLogger } from '@nestjs/common';

@SubCommand({
  name: 'uptime',
  description: 'get bitcoin node uptime',
})
export class UptimeCommand implements CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  constructor(private readonly bitcoinRpcClient: BitcoinRpcClient) {}

  public async run(): Promise<void> {
    const uptime = await this.bitcoinRpcClient.uptime();
    this.logger.log(`Bitcoin uptime is ${uptime} seconds`);
  }
}
