import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CampaignReportService } from '../services';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/fetch-campaign-reports-by-date-range';

@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  public getAllByEventName(@Param('event_name') eventName: string) {
    return this.campaignReportService.getByEventName(eventName);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public initiateDataFetch(@Body() dto: FetchCampaignReportsByDateRangeDto) {
    return this.campaignReportService.fetchCampaignReportsInRange(dto);
  }

  @Delete('/clean-up')
  public clean() {
    return this.campaignReportService.clean();
  }
}
