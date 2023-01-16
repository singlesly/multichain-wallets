import { Command, CommandRunner } from 'nest-commander';
import { AppListCommand } from './app-list.command';
import { AppGenCommand } from './app-gen.command';

@Command({
  name: 'app',
  description: 'apps tokens active',
  subCommands: [AppListCommand, AppGenCommand],
})
export class AppCommand extends CommandRunner {
  public async run(): Promise<void> {
    return void 0;
  }
}
