import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await useSwagger(app);

  await app.listen(3000);
})();
