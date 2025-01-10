import { endOfToday, format, isValid, parse, startOfToday } from 'date-fns';

export class DateUtil {
  public static parse(
    dateString: string,
    formatStr = 'yyyy-MM-dd HH:mm:ss',
  ): Date | null {
    return parse(dateString, formatStr, new Date());
  }

  public static isValid(date: unknown) {
    return isValid(date);
  }

  public static formatDate(
    date: Date,
    formatStr = 'yyyy-MM-dd HH:mm:ss',
  ): string {
    return format(date, formatStr);
  }

  public static startOfToday() {
    return startOfToday();
  }

  public static endOfToday() {
    return endOfToday();
  }
}

export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export function getFormattedStartAndEndOfToday() {
  const startOfDay = startOfToday();
  const endOfDay = endOfToday();

  return [
    format(startOfDay, DATE_TIME_FORMAT),
    format(endOfDay, DATE_TIME_FORMAT),
  ];
}
