import { IsDate, IsPositive, IsString } from 'class-validator';

export abstract class GetCampaignReportsByEventNameDto {
  @IsString()
  public event_name: Event;

  @IsPositive()
  public take: number;

  // TODO: REGEX VALIDATION
  @IsDate()
  public to_date: string;

  // TODO: REGEX VALIDATION
  @IsDate()
  public from_date: string;
}
