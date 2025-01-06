import { IsDate, IsPositive, IsString } from 'class-validator';
import { EventType } from 'src/common/enums/event-type.enum';

export abstract class GetCampaignReportsByEventNameDto {
  @IsString()
  public event_name: EventType;

  @IsPositive()
  public take: number;

  // TODO: REGEX VALIDATION
  @IsDate()
  public to_date: string;

  // TODO: REGEX VALIDATION
  @IsDate()
  public from_date: string;
}
