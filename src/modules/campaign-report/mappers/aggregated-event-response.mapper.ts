import {
  OffsetPaginationDto,
  PaginatedDto,
} from 'src/common/dtos/offset-pagination';
import { AggregatedEventDto } from '../dtos/aggregated-event.dto';

// TO INCAPSULATE RESPONSE MAPPING FUNCTIONALITY
export class AggregatedEventResponseMapper {
  public static toResponse(event: AggregatedEventDto) {
    return event;
  }

  public static toResponses(events: AggregatedEventDto[]) {
    return events.map(this.toResponse);
  }

  public static toPaginatedResponse(
    events: AggregatedEventDto[],
    meta: OffsetPaginationDto,
  ) {
    const responses = this.toResponses(events);
    return new PaginatedDto(responses, meta);
  }
}
