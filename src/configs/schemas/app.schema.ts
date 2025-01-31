import { envBooleanSchema } from 'src/common/utils/zod-types.utils';
import { z } from 'zod';

const Environment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

export const appSchema = z.object({
  NODE_ENV: z.enum([Environment.DEVELOPMENT, Environment.PRODUCTION]),
  HTTP_PORT: z.coerce.number().positive(),
  HTTP_HOST: z.string(),

  APP_NAME: z.coerce.string().default('Impulse_API'),

  APP_DEBUG: envBooleanSchema,
});
