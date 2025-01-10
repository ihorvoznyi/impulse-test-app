import { IsEnum, IsPositive } from 'class-validator';
import { IsDateFormat } from 'src/common/decorators';
import { EVENT_NAME } from 'src/modules/http-adapters/impulse-adapter';
import { EventName } from 'src/modules/http-adapters/impulse-adapter/const';

export abstract class FetchCampaignReportsByDateRangeDto {
  @IsDateFormat()
  public fromDate: string;

  @IsDateFormat()
  public toDate: string;

  @IsEnum(EVENT_NAME)
  public eventName: EventName;

  @IsPositive()
  public take: number;
}
