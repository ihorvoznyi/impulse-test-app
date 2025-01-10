import { IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/offset-pagination';
import { EVENT_NAME } from 'src/modules/http-adapters/impulse-adapter';

export abstract class GetAggregatedEventsReqDto extends PageOptionsDto {
  @IsString()
  public event_name: (typeof EVENT_NAME)[keyof typeof EVENT_NAME];

  @IsString()
  public to_date: string;

  @IsString()
  public from_date: string;
}
