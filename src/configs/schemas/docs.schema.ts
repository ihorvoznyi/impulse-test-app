import { z } from 'zod';

export const docsSchema = z.object({
  DOC_NAME: z.string().default('Impulse Test Docs'),
  DOC_PREFIX: z.string().default('api/docs'),
  DOC_VERSION: z.string().default('1.0'),
  DOC_DESCRIPTION: z.string().default(''),
});
