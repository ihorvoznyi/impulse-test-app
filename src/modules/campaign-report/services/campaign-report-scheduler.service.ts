import { Injectable, Logger } from '@nestjs/common';
import { CampaignReportService } from './campaign-report.service';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class CampaignReportScheduler {
  private readonly logger = new Logger(CampaignReportScheduler.name);

  constructor(private readonly campaignReportService: CampaignReportService) {}

  // TODO: consider using redis or DB (as a source of truth) and save latest request date and optimize calls in this way
  @Cron(CronExpression.EVERY_HOUR)
  @Timeout(5000)
  public handleCron() {
    this.logger.log('Executing campaign report service...');
  }
}
