import { IsDate } from 'class-validator';

export abstract class GetCampaignReportsByDateRangeDto {
  // TODO: REGEX VALIDATION
  @IsDate()
  public to_date: string;

  // TODO: REGEX VALIDATION
  @IsDate()
  public from_date: string;
}
