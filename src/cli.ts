#!/usr/local/bin/node

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

(async function () {
  try {
    await CommandFactory.run(AppModule);
  } catch (e) {
    console.log(e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
