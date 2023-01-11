import { Command, CommandRunner } from 'nest-commander';
import { ExportWalletCommand } from '@app/wallet/cli/export-wallet.command';

@Command({
  name: 'wallet',
  description: 'wallets commands',
  subCommands: [ExportWalletCommand],
})
export class WalletCommand implements CommandRunner {
  public async run(): Promise<void> {
    return void 0;
  }
}
