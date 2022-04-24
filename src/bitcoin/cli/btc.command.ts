import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'btc',
  description: 'Bitcoin entry',
})
export class BtcCommand implements CommandRunner {
  public async run(): Promise<void> {
    return void 0;
  }
}
