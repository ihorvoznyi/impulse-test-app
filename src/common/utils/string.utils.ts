export const stringToBoolean = (val?: string): boolean => {
  if (val === undefined || val === '') {
    return false;
  }
  return val.toLowerCase() === 'true' || val === '1';
};
