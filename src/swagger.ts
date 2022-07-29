import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import path from 'path';

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
    customSiteTitle: 'BCS | Crypto Bridge',
    customCss: fs.readFileSync(
      path.join(__dirname, '..', 'assets/swagger.css'),
      'utf8',
    ),
    customJs: `/assets/swagger.js`,
  });
}
