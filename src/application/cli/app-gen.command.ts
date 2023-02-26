import { CommandRunner, SubCommand } from 'nest-commander';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ApplicationService } from '@app/application/service/application.service';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';

@SubCommand({
  name: 'gen',
  arguments: '<name> <address>',
  description: 'generate new application',
})
@Injectable()
export class AppGenCommand extends CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly authUserRepository: AuthUserPgRepository,
  ) {
    super();
  }

  public async run(passedParams: string[]): Promise<void> {
    const name = passedParams[0];
    const address = passedParams[1];
    const user = await this.authUserRepository.getByAddress(address);
    const app = await this.applicationService.create({ name, userId: user.id });

    this.logger.log(`[Name] | id | secret`);
    this.logger.log(`[${app.name}] | ${app.authId()} | ${app.secret}`);
  }
}
