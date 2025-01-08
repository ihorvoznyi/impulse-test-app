import { format, isValid, parse } from 'date-fns';

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
}
