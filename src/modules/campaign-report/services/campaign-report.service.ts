import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ImpulseApiAdapter } from 'src/modules/http-adapters';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { FetchCampaignReportsByDateRangeDto } from '../dtos/fetch-campaign-reports-by-date-range';
import { catchError, map, Observable } from 'rxjs';
import { GetCampaignReportsApiDto } from 'src/modules/http-adapters/impulse-adapter/dtos';
import { CsvHelper } from 'src/common/helpers/csv';
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
      map((csvString) => CsvHelper.parse<IImpulseCampaignReport>(csvString)),
      map(ImpulseCompaignReportMapper.map),
      map(this.campaignReportsRepository.createInstance),
      map(this.bulkInsert),
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

  private async bulkInsert(entities: CampaignReportsEntity[]) {
    const result = { inserted: 0, skipped: 0, failed: [] };
    if (!entities?.length) {
      return result;
    }

    const chunkSize = 500;
    const chunks = splitIntoChunks(entities, chunkSize);
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

        inserted += result.identifiers.length;
        skipped += chunk.length - inserted;
      } catch (error) {
        failed.push({
          chunk,
          error,
        });
      }

      result.failed.push(failed);
      result.skipped += skipped;
      result.inserted += inserted;
    });

    await Promise.allSettled(promises);
    return result;
  }

  private async storeBatch(entities: CampaignReportsEntity[]) {
    if (!entities?.length) {
      this.logger.warn(`Skip ${CampaignReportsEntity.name}[] persistance`);
      return;
    }

    let successStoreCount = 0;
    const skipped = [];
    const errors: { chunk: CampaignReportsEntity[]; error: string }[] = [];
    const CHUNK_SIZE = 100;

    for (let i = 0; i < entities.length; i += CHUNK_SIZE) {
      const chunk = entities.slice(i, i + CHUNK_SIZE);

      try {
        const result = await this.campaignReportsRepository
          .createQueryBuilder()
          .insert()
          .into(CampaignReportsEntity)
          .values(chunk)
          .orIgnore()
          .execute();

        successStoreCount += result.identifiers.length;

        console.dir(result);

        const skippedValues = chunk.filter(
          (record) =>
            !result.identifiers.some((row) => {
              return record.hash === row?.hash;
            }),
        );

        skipped.push(skippedValues);
      } catch (error) {
        this.logger.error(error);
        errors.push({ chunk, error: error.message });
      }
    }

    return {
      errors,
      skipped,
      failed: errors.length,
      success: successStoreCount,
    };
  }
}
