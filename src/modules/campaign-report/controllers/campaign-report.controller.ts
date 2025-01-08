import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CampaignReportService } from '../services';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/fetch-campaign-reports-by-date-range';

@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  public getAllByEventName() {
    return this.campaignReportService.getByEventName('payment');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public initiateDataFetch(@Body() dto: FetchCampaignReportsByDateRangeDto) {
    return this.campaignReportService.fetchCampaignReportsInRange(dto);
  }
}
