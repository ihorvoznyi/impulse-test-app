import { SelectQueryBuilder } from 'typeorm';
import { OffsetPaginationDto, PageOptionsDto } from '../dtos/offset-pagination';

type PaginateOptions<T> = Partial<{
  raw: boolean;
  takeAll: boolean;
  skipCount: boolean;
  customCountQueryFn: SelectQueryBuilder<T>;
}>;

type PaginationResult<T> = [T[], OffsetPaginationDto];

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pageOptionsDto: PageOptionsDto,
  options?: PaginateOptions<T>,
): Promise<PaginationResult<T>> {
  const {
    raw = false,
    takeAll = false,
    skipCount = false,
    customCountQueryFn: countQueryFn,
  } = options || {};

  if (!takeAll) {
    queryBuilder.skip(pageOptionsDto.offset).take(pageOptionsDto.take);
  }

  const entities = raw
    ? await queryBuilder.getRawMany()
    : await queryBuilder.getMany();

  let count = -1;
  if (!skipCount) {
    count = await (countQueryFn
      ? countQueryFn
          .getRawOne()
          .then((res) => parseInt(Object.values(res)[0] as string, 10))
      : queryBuilder.getCount());
  }

  const meta = new OffsetPaginationDto(count, pageOptionsDto);

  return [entities, meta];
}
