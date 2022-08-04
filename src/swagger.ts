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
    .setDescription(
      'Welcome! Using endpoints below to interact with blockchains in any supported cryptocurrencies',
    )
    .setContact(
      'Artem Ilinykh',
      'https://gitlab.com/devsinglesly',
      'devsinglesly@gmail.com',
    )
    .setLicense('MIT', 'https://choosealicense.com/licenses/mit')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'Crypto-Bridge',
    customCssUrl: '/public/swagger/theme-feeling-blue.css',
  } as ExpressSwaggerCustomOptions);
}
