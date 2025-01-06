import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CampaignReportService } from '../services';

@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  public getAllByEventName() {
    return this.campaignReportService.getByEventName('payment');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public initiateDataFetch() {
    console.info('did an operation');
  }
}
