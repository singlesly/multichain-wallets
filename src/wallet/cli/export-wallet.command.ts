import { CommandRunner, SubCommand } from 'nest-commander';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import { ConsoleLogger } from '@nestjs/common';

@SubCommand({
  name: 'export',
  arguments: '<address>',
  description: 'export wallet private key by address',
})
export class ExportWalletCommand implements CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  constructor(
    private readonly walletService: GetWalletService,
    private readonly encrypt: EncryptService,
  ) {}

  public async run(passedParams: string[]): Promise<void> {
    const address = passedParams[0];

    const wallet = await this.walletService.getByAddress(address);

    this.logger.log(`Exported wallet: ${wallet.network}/${wallet.coin}`);
    this.logger.log(`address: ${wallet.pubKey}`);
    this.logger.log(
      `private key: ${await this.encrypt.decrypt(wallet.privateKey)}`,
    );
  }
}
