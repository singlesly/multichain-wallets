import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

(async function () {
  await CommandFactory.run(AppModule, new ConsoleLogger());
})();
