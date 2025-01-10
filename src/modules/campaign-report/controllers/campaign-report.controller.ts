import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CampaignReportService } from '../services';
import {
  GetAggregatedEventsReqDto,
  FetchCampaignReportsReqDto,
} from '../dtos/requests';
import { ManualFetchResDto, PaginatedEventsResponse } from '../dtos/responses';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

@ApiTags('Campaign Reports')
@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get Campaign Reports' })
  @ApiResponse({
    status: 200,
    description: 'Successful response with paginated campaign reports',
    type: PaginatedEventsResponse,
  })
  @ApiResponse({
    status: 400,
    description: '[4XX] Bad Request - Invalid parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unable to fetch reports',
  })
  public getCampaignReports(
    @Query() dto: GetAggregatedEventsReqDto,
  ): Promise<PaginatedEventsResponse> {
    return this.campaignReportService.getAggregatedEvents(dto);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate Campaign Data Fetch' })
  @ApiResponse({
    status: 200,
    description: 'Successful data fetch initiation',
    type: ManualFetchResDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid payload',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to fetch campaign reports',
  })
  @ApiBody({
    description: 'Details for fetching campaign reports within a date range',
    type: FetchCampaignReportsReqDto,
  })
  public initiateDataFetch(
    @Body() dto: FetchCampaignReportsReqDto,
  ): Promise<Observable<ManualFetchResDto>> {
    return this.campaignReportService.fetchCampaignReportsInRange(dto);
  }
}
