import { Command, CommandRunner } from 'nest-commander';
import { UptimeCommand } from './uptime.command';

@Command({
  name: 'btc',
  arguments: '<task>',
  description: 'Bitcoin entry',
  subCommands: [UptimeCommand],
})
export class BtcCommand implements CommandRunner {
  public async run(): Promise<void> {
    return void 0;
  }
}
