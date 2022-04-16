import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function useSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Crypto Bridge')
    .setDescription('The cryptocurrency bridge API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('', app, document);
}
