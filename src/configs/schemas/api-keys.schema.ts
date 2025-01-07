import { z } from 'zod';

export const apiKeySchema = z.object({
  X_API_KEY: z.string().min(1),
});
