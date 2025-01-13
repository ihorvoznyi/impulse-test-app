import { z } from 'zod';

export const rateLimitSchema = z.object({
  RATE_LIMIT_MAX: z.coerce.number(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number(),
});
