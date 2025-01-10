import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ImpulseApiAdapter } from 'src/modules/http-adapters';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { FetchCampaignReportsReqDto } from '../dtos/requests/fetch-campaign-reports.req.dto';
import { catchError, map, Observable, reduce, mergeMap } from 'rxjs';
import { GetCampaignReportsApiDto } from 'src/modules/http-adapters/impulse-adapter/dtos';
import { CsvService } from 'src/modules/libs/csv';
import { IImpulseCampaignReport } from 'src/modules/http-adapters/impulse-adapter/interfaces';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';
import { ImpulseCompaignReportMapper } from '../mappers/impulse-compaign-report.mapper';
import { splitIntoChunks } from 'src/common/utils/array.utils';
import { paginate } from 'src/common/utils/offset-pagination.util';
import { DateUtil } from 'src/common/utils/date.util';
import { CampaignReportsQueryBuilder } from './helpers';
import { AggregatedEventDto } from '../dtos/aggregated-event.dto';
import { AggregatedEventResponseMapper } from '../mappers/aggregated-event-response.mapper';
import { GetAggregatedEventsReqDto } from '../dtos/requests';
import { ManualFetchResDto } from '../dtos/responses';

@Injectable()
export class CampaignReportService {
  private readonly logger = new Logger(CampaignReportService.name);

  constructor(
    private readonly campaignReportsQueryBuilder: CampaignReportsQueryBuilder,
    private readonly impulseApiAdapter: ImpulseApiAdapter,
    private readonly campaignReportsRepository: CampaignReportsRepository,
  ) {}

  public async getAggregatedEvents(
    getAggregatedEventsDto: GetAggregatedEventsReqDto,
  ) {
    const eventName = getAggregatedEventsDto.event_name;
    const endDate = DateUtil.parse(getAggregatedEventsDto.to_date);
    const startDate = DateUtil.parse(getAggregatedEventsDto.from_date);

    const campaignReportsQuery =
      this.campaignReportsQueryBuilder.buildAggregatedEventsQuery(
        eventName,
        endDate,
        startDate,
      );

    const campaignReportsCountQuery =
      this.campaignReportsQueryBuilder.buildAggregatedCountQuery(
        eventName,
        endDate,
        startDate,
      );

    try {
      const [aggregatedEvents, meta] = await paginate<AggregatedEventDto>(
        campaignReportsQuery,
        getAggregatedEventsDto,
        {
          raw: true,
          takeAll: false,
          skipCount: false,
          customCountQueryFn: campaignReportsCountQuery,
        },
      );

      return AggregatedEventResponseMapper.toPaginatedResponse(
        aggregatedEvents,
        meta,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async clean() {
    return await this.campaignReportsRepository.clear();
  }

  public async fetchCampaignReportsInRange(
    fetchCampaignReportsInRange: FetchCampaignReportsReqDto,
  ) {
    return this.handlePaginatedFetch(fetchCampaignReportsInRange).pipe(
      map((csvString) => CsvService.parse<IImpulseCampaignReport>(csvString)),
      map(ImpulseCompaignReportMapper.map),
      map(this.campaignReportsRepository.createInstance),
      mergeMap(
        (instances) => this.bulkInsert(instances).then((result) => result), // Resolve the Promise
      ),
      reduce(
        (acc, current: ManualFetchResDto) => {
          acc.totalInserted += current.totalInserted;
          acc.totalSkipped += current.totalSkipped;
          acc.totalFailed += current.totalFailed;
          return acc;
        },
        {
          totalInserted: 0,
          totalSkipped: 0,
          totalFailed: 0,
        } as ManualFetchResDto,
      ),
      catchError((err) => {
        throw new HttpException(
          `Error processing reports: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  private handlePaginatedFetch(params: FetchCampaignReportsReqDto) {
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
        to_date: params.toDate,
        from_date: params.fromDate,
      });
    });
  }

  private async bulkInsert(
    entities: CampaignReportsEntity[],
  ): Promise<ManualFetchResDto> {
    const bulkInsertResult: ManualFetchResDto = {
      totalFailed: 0,
      totalSkipped: 0,
      totalInserted: 0,
    };
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

      bulkInsertResult.totalInserted += inserted;
      bulkInsertResult.totalFailed += failed.length;
      bulkInsertResult.totalSkipped += skipped;
    });

    return bulkInsertResult;
  }
}
