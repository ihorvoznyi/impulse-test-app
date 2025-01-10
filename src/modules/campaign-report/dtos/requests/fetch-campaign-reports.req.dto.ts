import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsDateFormat } from 'src/common/decorators';
import { EVENT_NAME } from 'src/modules/http-adapters/impulse-adapter';
import { EventName } from 'src/modules/http-adapters/impulse-adapter/const';

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
  public eventName: EventName;
}
