import { Injectable, Logger } from '@nestjs/common';
import { CsvHelper } from 'src/common/helpers/csv';
import { ImpulseApiAdapter } from 'src/modules/http-adapters';
import { CampaignReportsRepository } from 'src/persistance/repositories';

@Injectable()
export class CampaignReportService {
  private readonly logger = new Logger(CampaignReportService.name);

  constructor(
    private readonly impulseApiAdapter: ImpulseApiAdapter,
    private readonly campaignReportsRepository: CampaignReportsRepository,
  ) {}

  public async getByEventName(eventName: string) {
    return await this.campaignReportsRepository.find({ where: { eventName } });
  }

  public async fetchCampaignReportsInRange() {
    const data: any[] = [];
    let nextUrl: string | undefined;

    let retry = 0;

    try {
      do {
        const res = await this.impulseApiAdapter.fetchCampaignReports(
          nextUrl || {
            take: 15,
            from_date: '2024-12-15 00:00:00',
            to_date: '2024-12-15 23:59:59',
            event_name: 'purchase',
          },
        );

        const { csv, pagination } = res.data;
        const campaignReports = CsvHelper.parse(csv, true);
        this.logger.log(campaignReports, res.timestamp);

        data.push(campaignReports);

        nextUrl = pagination?.next || null;
        if (nextUrl) {
          await this.delay(2000);
        }

        ++retry;
      } while (retry < 3);

      return data.flat();
    } catch (error) {
      this.logger.error(
        'Error while fetching campaign reports from the API',
        error.stack,
      );
      throw new Error('Unable to fetch campaign reports from the API.');
    }
  }

  /**
   * Delay execution for a specified duration (in milliseconds).
   * @param ms - Milliseconds to wait.
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
