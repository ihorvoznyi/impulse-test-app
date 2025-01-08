import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ImpulseApiAdapter } from 'src/modules/http-adapters';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/fetch-campaign-reports-by-date-range';
import { catchError, map, Observable } from 'rxjs';
import { GetCampaignReportsApiDto } from 'src/modules/http-adapters/impulse-adapter/dtos';
import { CsvHelper } from 'src/common/helpers/csv';
import { IImpulseCampaignReport } from 'src/modules/http-adapters/impulse-adapter/interfaces';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';
import { DateUtil } from 'src/common/utils/date.util';

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

  public async fetchCampaignReportsInRange(
    fetchCampaignReportsInRange: FetchCampaignReportsByDateRangeDto,
  ) {
    const result = this.handlePaginatedFetch(fetchCampaignReportsInRange).pipe(
      map((csvString) => CsvHelper.parse<IImpulseCampaignReport>(csvString)),
      map((impulseCampaignReports: IImpulseCampaignReport[]) => {
        return impulseCampaignReports.map((report) => ({
          clientId: report.client_id,
          campaign: report.campaign,
          campaignId: report.campaign_id,
          ad: report.ad,
          adId: report.ad_id,
          adgroup: report.adgroup,
          adgroupId: report.adgroup_id,
          eventName: report.event_name,
          eventTime: DateUtil.parse(report.event_time),
        })) as CampaignReportsEntity[];
      }),
      map(async (campaignReportEntities) => {
        await this.storeBatch(campaignReportEntities);
        return campaignReportEntities;
      }),
      catchError((err) => {
        throw new HttpException(
          `Error processing reports: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );

    return result;
  }

  private handlePaginatedFetch(params: FetchCampaignReportsByDateRangeDto) {
    return new Observable<string>((subscriber) => {
      const fetchPageData = async (
        nextParams: string | GetCampaignReportsApiDto,
      ) => {
        try {
          const promise = this.impulseApiAdapter.getCampaignReports(nextParams);
          const { data } = await promise;
          const { csv, pagination } = data.data;

          subscriber.next(csv);

          if (pagination?.next) {
            await fetchPageData(pagination.next);
          } else {
            this.logger.log('completed');
            subscriber.complete();
          }
        } catch (error) {
          subscriber.error(error);
        }
      };

      fetchPageData({
        event_name: params.eventName,
        take: 50,
        to_date: params.toDate,
        from_date: params.fromDate,
      });
    });
  }

  private async storeBatch(entities: CampaignReportsEntity[]): Promise<void> {
    try {
      // await this.campaignReportsRepository.save(campaignReportEntities, { chunk: 50 });
      this.logger.log(`SAVED: ${entities.length}`);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to store reports');
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
