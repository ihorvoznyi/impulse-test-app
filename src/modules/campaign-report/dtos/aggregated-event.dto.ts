import { ApiProperty } from '@nestjs/swagger';

export class AggregatedEventDto {
  @ApiProperty()
  readonly adId: string;

  @ApiProperty()
  readonly eventTime: string;

  @ApiProperty()
  readonly eventName: string;

  @ApiProperty()
  readonly eventCount: number;
}
