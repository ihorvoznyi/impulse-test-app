import { apiKeySchema } from './api-keys.schema';
import { appSchema } from './app.schema';
import { databaseSchema } from './db.schema';
import { docsSchema } from './docs.schema';

export const envSchemas = appSchema
  .and(databaseSchema)
  .and(apiKeySchema)
  .and(docsSchema);
