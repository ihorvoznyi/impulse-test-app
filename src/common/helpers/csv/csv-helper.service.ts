import { Injectable } from '@nestjs/common';
import { CastingFunction, parse } from 'csv-parse/sync';

@Injectable()
export class CsvHelper {
  public static parse(csv: string, cast: CastingFunction | boolean = true) {
    try {
      const records = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        cast,
      });

      return records;
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error.message);
      throw new Error('Failed to fetch or parse CSV data');
    }
  }
}