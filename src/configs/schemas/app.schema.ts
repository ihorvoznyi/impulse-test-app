import { z } from 'zod';

const Environment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

export const appSchema = z.object({
  NODE_ENV: z.enum([Environment.DEVELOPMENT, Environment.PRODUCTION]),
  HTTP_PORT: z.coerce.number().positive(),
  HTTP_HOST: z.string(),

  APP_DEBUG: z.coerce.boolean().default(false),
});
