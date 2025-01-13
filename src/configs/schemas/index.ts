import { apiKeySchema } from './api-keys.schema';
import { appSchema } from './app.schema';
import { cacheSchema } from './cache.schema';
import { databaseSchema } from './db.schema';
import { docsSchema } from './docs.schema';
import { rateLimitSchema } from './rate-limit.schema';

export const envSchemas = appSchema
  .and(databaseSchema)
  .and(apiKeySchema)
  .and(docsSchema)
  .and(cacheSchema)
  .and(rateLimitSchema);
