import { z } from 'zod';

/**
 * A Zod schema that transforms and validates boolean-like values.
 */
export const envBooleanSchema = z.preprocess((val): boolean => {
  if (typeof val === 'string') {
    if (['1', 'true'].includes(val.toLowerCase())) return true;
    if (['0', 'false'].includes(val.toLowerCase())) return false;
  }
  return val === true;
}, z.coerce.boolean()) as unknown as z.ZodBoolean;
