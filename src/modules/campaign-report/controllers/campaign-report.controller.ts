import {
  Body,
  Controller,
  Delete,
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
import { PaginatedEventsResponse } from '../dtos/responses';

@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  public getCampaignReports(
    @Query() dto: GetAggregatedEventsReqDto,
  ): Promise<PaginatedEventsResponse> {
    return this.campaignReportService.getAggregatedEvents(dto);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public initiateDataFetch(@Body() dto: FetchCampaignReportsReqDto) {
    return this.campaignReportService.fetchCampaignReportsInRange(dto);
  }

  @Delete('/clean-up')
  public clean() {
    return this.campaignReportService.clean();
  }
}
