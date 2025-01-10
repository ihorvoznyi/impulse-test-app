export function isObjectEmpty(obj: unknown): boolean {
  if (typeof obj !== 'object' || !obj) {
    return false;
  }

  return Object.keys(obj).length === 0;
}
