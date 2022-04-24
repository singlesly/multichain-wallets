import { Command, CommandRunner } from 'nest-commander';
import { AppListCommand } from './app-list.command';

@Command({
  name: 'app',
  description: 'apps tokens active',
  subCommands: [AppListCommand],
})
export class AppCommand implements CommandRunner {
  public async run(): Promise<void> {
    return void 0;
  }
}
