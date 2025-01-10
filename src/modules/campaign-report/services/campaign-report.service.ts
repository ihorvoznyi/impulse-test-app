import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ImpulseApiAdapter } from 'src/modules/http-adapters';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/requests/fetch-campaign-reports-by-date-range';
import { catchError, map, Observable } from 'rxjs';
import { GetCampaignReportsApiDto } from 'src/modules/http-adapters/impulse-adapter/dtos';
import { CsvService } from 'src/modules/libs/csv';
import { IImpulseCampaignReport } from 'src/modules/http-adapters/impulse-adapter/interfaces';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';
import { ImpulseCompaignReportMapper } from '../mappers/impulse-compaign-report.mapper';
import { splitIntoChunks } from 'src/common/utils/array.utils';

@Injectable()
export class CampaignReportService {
  private readonly logger = new Logger(CampaignReportService.name);

  constructor(
    private readonly impulseApiAdapter: ImpulseApiAdapter,
    private readonly campaignReportsRepository: CampaignReportsRepository,
  ) {}

  public async getByEventName(eventName: string) {
    throw new NotFoundException(eventName);
    return await this.campaignReportsRepository.findMany({
      where: { eventName },
    });
  }

  public async clean() {
    return await this.campaignReportsRepository.clear();
  }

  public async fetchCampaignReportsInRange(
    fetchCampaignReportsInRange: FetchCampaignReportsByDateRangeDto,
  ) {
    const result = this.handlePaginatedFetch(fetchCampaignReportsInRange).pipe(
      map((csvString) => CsvService.parse<IImpulseCampaignReport>(csvString)),
      map(ImpulseCompaignReportMapper.map),
      map(this.campaignReportsRepository.createInstance),
      map((instances) => this.bulkInsert(instances)),
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
        take: params.take,
        to_date: params.toDate,
        from_date: params.fromDate,
      });
    });
  }

  private async bulkInsert(entities: CampaignReportsEntity[]) {
    const bulkInsertResult = { inserted: 0, skipped: 0, failed: [] };
    if (!entities?.length) {
      return bulkInsertResult;
    }

    const CHUNK_SIZE = 500;
    const chunks = splitIntoChunks(entities, CHUNK_SIZE);
    const promises = chunks.map(async (chunk) => {
      let skipped = 0;
      let inserted = 0;
      const failed: { chunk: CampaignReportsEntity[]; error: any }[] = [];

      try {
        const result = await this.campaignReportsRepository
          .createQueryBuilder()
          .insert()
          .into(CampaignReportsEntity)
          .values(chunk)
          .orIgnore()
          .execute();

        inserted += result.identifiers.reduce((acc, identifier) => {
          if (Boolean(identifier?.id)) {
            acc += 1;
          }
          return acc;
        }, 0);

        skipped += chunk.length - inserted;
      } catch (error) {
        failed.push({
          chunk,
          error,
        });
        this.logger.error(error);
      }

      return { skipped, inserted, failed };
    });

    const promisesResult = await Promise.allSettled(promises);

    promisesResult.forEach((entry) => {
      if (entry.status === 'rejected') {
        return;
      }

      const { failed, inserted, skipped } = entry.value;

      bulkInsertResult.failed.push(failed);
      bulkInsertResult.inserted += inserted;
      bulkInsertResult.skipped += skipped;
    });

    return bulkInsertResult;
  }
}
