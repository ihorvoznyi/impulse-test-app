import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/offset-pagination';
import { EVENT_NAME } from 'src/modules/http-adapters/impulse-adapter';
import { EventName } from 'src/modules/http-adapters/impulse-adapter/const';

export abstract class GetAggregatedEventsReqDto extends PageOptionsDto {
  @ApiProperty({
    required: true,
    example: Object.values(EVENT_NAME).join(' | '),
  })
  @IsString()
  public event_name: EventName;

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
