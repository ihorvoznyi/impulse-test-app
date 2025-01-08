import { z } from 'zod';

export const apiKeySchema = z.object({
  IMPULSE_API: z.string().url(),
  IMPULSE_X_API_KEY: z.string().min(1),
});
