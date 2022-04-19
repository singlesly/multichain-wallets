import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';
import { EthereumWeb3Service } from './ethereum/services/ethereum-web3.service';
import utils from 'web3-utils';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return String(this);
};

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await useSwagger(app);

  await app.listen(3000);
})();
