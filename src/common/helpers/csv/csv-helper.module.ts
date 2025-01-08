import { Module } from '@nestjs/common';
import { CsvHelper } from './csv-helper.service';

@Module({
  providers: [CsvHelper],
  exports: [CsvHelper],
})
export class CsvHelperModule {}
