import { SelectQueryBuilder } from 'typeorm';
import { OffsetPaginationDto, PageOptionsDto } from '../dtos/offset-pagination';

export async function paginate<T>(
  builder: SelectQueryBuilder<T>,
  pageOptionsDto: PageOptionsDto,
  options?: {
    takeAll: boolean;
    skipCount: boolean;
  },
): Promise<[T[], OffsetPaginationDto]> {
  if (!options?.takeAll) {
    builder.skip(pageOptionsDto.offset).take(pageOptionsDto.take);
  }

  const entities = await builder.getMany();

  let count = -1;
  if (!options?.skipCount) {
    count = await builder.getCount();
  }

  const meta = new OffsetPaginationDto(count, pageOptionsDto);

  return [entities, meta];
}
