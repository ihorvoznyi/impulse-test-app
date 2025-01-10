import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CampaignReportService } from '../services';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/requests/fetch-campaign-reports-by-date-range';

@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Get()
  public async getCampaignReports(
    @Query('take') take: string,
    @Query('page') page: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const takeNumber = parseInt(take, 10) || 10;
    const baseUrl = '';
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
