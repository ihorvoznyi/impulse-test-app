import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CampaignReportService {
  private readonly logger = new Logger(CampaignReportService.name);

  public async getByEventName(eventName: string) {
    this.logger.log(eventName);
    return [];
  }

  public fetchCampaignReportsInRange(from: string, to: string) {
    this.logger.log(`Fetching records in range: ${from} to ${to}`);
  }
}
