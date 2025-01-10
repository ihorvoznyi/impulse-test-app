import { PaginatedDto } from 'src/common/dtos/offset-pagination';
import { AggregatedEventDto } from '../aggregated-event.dto';

export abstract class PaginatedEventsResponse extends PaginatedDto<AggregatedEventDto> {}
