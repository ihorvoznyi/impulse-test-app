import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetPaginationDto } from './offset-pagination.dto';

export class PaginatedDto<T> {
  @ApiProperty()
  @Expose()
  readonly data: T[];

  @ApiProperty()
  @Expose()
  pagination: OffsetPaginationDto;

  constructor(data: T[], meta: OffsetPaginationDto) {
    this.data = data;
    this.pagination = meta;
  }
}
