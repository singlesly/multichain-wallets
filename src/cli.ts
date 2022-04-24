#!/bin/node

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

(async function () {
  await CommandFactory.run(AppModule);
})();
