import { INestApplication } from '@nestjs/common';
import { Environment } from './configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const appName = Environment.APP_NAME;

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('Event Syncronization application for Impulse API')
    .addServer(Environment.APP_URL, 'development')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: appName,
  });
}
