import { CommandRunner, SubCommand } from 'nest-commander';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ApplicationService } from '@app/application/service/application.service';

@SubCommand({
  name: 'gen',
  arguments: '<name>',
  description: 'generate new application',
})
@Injectable()
export class AppGenCommand extends CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  constructor(private readonly applicationService: ApplicationService) {
    super();
  }

  public async run(passedParams: string[]): Promise<void> {
    const name = passedParams[0];
    const app = await this.applicationService.create({ name });

    this.logger.log(`[Name] | id | secret`);
    this.logger.log(`[${app.name}] | ${app.authId()} | ${app.secret}`);
  }
}
