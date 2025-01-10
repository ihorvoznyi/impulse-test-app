import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EVENT_NAME } from 'src/common/const/event-name.const';
import { IsDateFormat } from 'src/common/decorators';
import { CampaignReportEvent } from 'src/common/interfaces/campaign-report';

export abstract class FetchCampaignReportsReqDto {
  @ApiProperty({
    required: true,
    example: 'YYYY-MM-DD HH:00:00',
  })
  @IsDateFormat()
  public fromDate: string;

  @ApiProperty({
    required: true,
    example: 'YYYY-MM-DD HH:00:00',
  })
  @IsDateFormat()
  public toDate: string;

  @ApiProperty({
    required: true,
    example: Object.values(EVENT_NAME).join(' | '),
  })
  @IsEnum(EVENT_NAME)
  public eventName: CampaignReportEvent;
}
