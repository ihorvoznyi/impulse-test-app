import { ApiProperty } from '@nestjs/swagger';

export abstract class ManualFetchResDto {
  @ApiProperty({
    example: 25,
  })
  totalInserted: number;

  @ApiProperty({
    example: 176,
  })
  totalSkipped: number;

  @ApiProperty({
    example: 201,
  })
  totalFailed: number;
}
