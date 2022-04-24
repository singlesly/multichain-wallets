import { CommandRunner, SubCommand } from 'nest-commander';
import { Application } from '../dao/entity/application';
import { ConsoleLogger } from '@nestjs/common';

@SubCommand({
  name: 'list',
  description: 'get current application with secrets',
})
export class AppListCommand implements CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  public async run(): Promise<void> {
    const apps = await Application.find({
      order: {
        createdAt: 'DESC',
      },
    });

    this.logger.log(`Count application: ${apps.length}`);

    for (const app of apps) {
      this.logger.log(`[Name] | id | secret`);
      this.logger.log(`[${app.name}] | ${app.id} | ${app.secret}`);
    }
  }
}
