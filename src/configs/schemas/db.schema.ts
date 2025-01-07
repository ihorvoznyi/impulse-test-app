import { z } from 'zod';

export const databaseSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().positive(),
  DB_NAME: z.string().min(1),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),

  DB_MAX_CONNECTIONS: z.coerce.number().positive().default(2),

  DB_ENABLE_SSL: z.coerce.boolean().default(false),

  DB_SSL_REJECT_UNAUTHORIZED: z.coerce.boolean().default(false),
  DB_SSL_CA: z.string(),
  DB_SSL_KEY: z.string(),
  DB_SSL_CERT: z.string(),
});
