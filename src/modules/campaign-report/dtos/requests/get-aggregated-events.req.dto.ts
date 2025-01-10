import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EVENT_NAME } from 'src/common/const/event-name.const';
import { PageOptionsDto } from 'src/common/dtos/offset-pagination';
import { CampaignReportEvent } from 'src/common/interfaces/campaign-report';

export abstract class GetAggregatedEventsReqDto extends PageOptionsDto {
  @ApiProperty({
    required: true,
    example: Object.values(EVENT_NAME).join(' | '),
  })
  @IsString()
  public event_name: CampaignReportEvent;

  @ApiProperty({
    required: true,
    example: 'YYYY-MM-DD HH:00:00',
  })
  @IsString()
  public to_date: string;

  @ApiProperty({
    required: true,
    example: 'YYYY-MM-DD HH:00:00',
  })
  @IsString()
  public from_date: string;
}
