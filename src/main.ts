import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';

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
