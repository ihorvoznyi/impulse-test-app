import { PaginatedDto } from 'src/common/dtos/offset-pagination';
import { AggregatedEventDto } from '../aggregated-event.dto';

export type PaginatedEventsResponse = PaginatedDto<AggregatedEventDto>;
export type AggregatedEventList = AggregatedEventDto[];
