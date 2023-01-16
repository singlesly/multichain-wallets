import { CommandRunner, SubCommand } from 'nest-commander';
import { randomBytes, createHash } from 'crypto';
import { Application } from '../dao/entity/application';
import { ConsoleLogger } from '@nestjs/common';

@SubCommand({
  name: 'gen',
  arguments: '<name>',
  description: 'generate new application',
})
export class AppGenCommand extends CommandRunner {
  private readonly logger: ConsoleLogger = new ConsoleLogger();

  public async run(passedParams: string[]): Promise<void> {
    const name = passedParams[0];
    const salt = randomBytes(64).toString('hex');
    const nameSha = createHash('sha256').update(name).digest('hex');
    const secret = createHash('sha256')
      .update(salt + nameSha)
      .digest('hex');

    const app = await new Application(name, secret).save();

    this.logger.log(`[Name] | id | secret`);
    this.logger.log(`[${app.name}] | ${app.authId()} | ${app.secret}`);
  }
}
