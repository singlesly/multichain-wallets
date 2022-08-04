import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  ExpressSwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export async function useSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Crypto Bridge')
    .addBasicAuth()
    .addBearerAuth()
    .setDescription('The cryptocurrency bridge API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'Crypto-Bridge',
    customCssUrl: '/public/swagger/theme-feeling-blue.css',
  } as ExpressSwaggerCustomOptions);
}
