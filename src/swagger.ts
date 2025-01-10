import { INestApplication } from '@nestjs/common';
import { Environment } from './configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';

export function setupSwagger(app: INestApplication) {
  const docName = Environment.DOC_NAME;
  const docPrefix = Environment.DOC_PREFIX;
  const docVersion = Environment.DOC_VERSION;
  const docDescription = Environment.DOC_DESCRIPTION;

  const config = new DocumentBuilder()
    .setTitle(docName)
    .setDescription(docDescription)
    .setVersion(docVersion)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  writeFileSync('swagger.json', JSON.stringify(document));
  SwaggerModule.setup(docPrefix, app, document, {
    customSiteTitle: docName,

    jsonDocumentUrl: `${docPrefix}/json`,
    yamlDocumentUrl: `${docPrefix}/yaml`,
  });
}
