import { Injectable, Logger } from '@nestjs/common';
import { CampaignReportService } from './campaign-report.service';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class CampaignReportScheduler {
  private readonly logger = new Logger(CampaignReportScheduler.name);

  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Cron(CronExpression.EVERY_HOUR)
  @Timeout(5000)
  public handleCron() {
    this.logger.log('Executing campaign report service...');

    try {
      // const result = this.campaignReportService.fetchCampaignReportsInRange();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
