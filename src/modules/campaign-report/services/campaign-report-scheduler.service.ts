import { Injectable, Logger } from '@nestjs/common';
import { CampaignReportService } from './campaign-report.service';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { getFormattedStartAndEndOfToday } from 'src/common/utils/date.util';
import { FetchCampaignReportsReqDto } from '../dtos/requests';
import { CampaignReportEvent } from 'src/common/interfaces/campaign-report';
import { EVENT_NAME } from 'src/common/const/event-name.const';

const ONE_MINUTE = 60_000;

@Injectable()
export class CampaignReportScheduler {
  private readonly logger = new Logger(CampaignReportScheduler.name);

  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Cron(CronExpression.EVERY_HOUR)
  @Timeout(ONE_MINUTE)
  public async executeCampaignReportFetch() {
    this.logger.log('Executing campaign report service...');

    const events = Object.values(EVENT_NAME);
    const fetchParams = events.map(this.createFetchRequestParams);

    try {
      // TODO: optimize amount of calls PROBABLY USING CACHE
      await this.fetchReportsForEvents(fetchParams);
      this.logger.log('Campaign report fetch task completed successfully.');
    } catch (error) {
      // TODO: consider storing failed events in the DB or captchure event in tool like Sentry
      this.logger.error('Failed to execute campaign report fetch task.', error);
    }
  }

  private createFetchRequestParams(
    eventName: CampaignReportEvent,
  ): FetchCampaignReportsReqDto {
    const [fromDate, toDate] = getFormattedStartAndEndOfToday();
    return {
      fromDate,
      toDate,
      eventName,
    };
  }

  private async fetchReportsForEvents(dtos: FetchCampaignReportsReqDto[]) {
    const fetchPromises = dtos.map(async (params) => {
      try {
        await this.campaignReportService.fetchCampaignReportsInRange(params);
        this.logger.log(
          `Successfully fetched reports for event: ${params.eventName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to fetch reports for event: ${params.eventName}`,
          error,
        );
      }
    });

    await Promise.all(fetchPromises);
  }
}
