import { createHash } from 'node:crypto';

export class CryptoUtil {
  public static computeSHA256(input: string | string[]) {
    const value = Array.isArray(input) ? input.join('|') : input;
    return createHash('sha256').update(value).digest('hex');
  }
}

export function computeSHA256(input: string | string[]) {
  const value = Array.isArray(input) ? input.join('|') : input;
  return createHash('sha256').update(value).digest('hex');
}
