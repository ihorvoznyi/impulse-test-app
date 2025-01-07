import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  static validateWithZod<T>(
    schema: Zod.Schema<T>,
    data: unknown,
  ): { success: true; data: T } | { success: false; issues: Zod.ZodIssue[] } {
    const result = schema.safeParse(data);
    if (!result.success) {
      return { success: false, issues: result.error.errors };
    }

    return { success: true, data: result.data };
  }
}
