import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { CampaignReportsEntity } from '../entities/campaign-reports.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CampaignReportsRepository extends Repository<CampaignReportsEntity> {
  constructor(
    @InjectRepository(CampaignReportsEntity)
    private readonly campaignReportRepository: Repository<CampaignReportsEntity>,
  ) {
    super(
      campaignReportRepository.target,
      campaignReportRepository.manager,
      campaignReportRepository.queryRunner,
    );
  }

  /**
   * Finds multiple CampaignReportsEntity records based on the provided query options.
   * @param options - FindManyOptions for filtering, sorting, and pagination.
   * @returns A promise resolving to an array of CampaignReportsEntity objects.
   */
  public findMany(options: FindManyOptions<CampaignReportsEntity>) {
    return this.campaignReportRepository.find(options);
  }

  /**
   * Finds multiple CampaignReportsEntity records or throws an error if none are found.
   * @param options - FindManyOptions for filtering, sorting, and pagination.
   * @returns A promise resolving to an array of CampaignReportsEntity objects.
   * @throws An error if no records are found.
   */
  public async findManyOrFail(options: FindManyOptions<CampaignReportsEntity>) {
    const entities = await this.campaignReportRepository.find(options);
    if (!entities.length) {
      throw new Error(`${CampaignReportsEntity.name} not found`);
    }

    return entities;
  }

  /**
   * Creates a new instance or multiple instances of CampaignReportsEntity without persisting them.
   * @param deepPartial - A partial representation of one or more entities.
   * @returns A single CampaignReportsEntity instance or an array of instances.
   *
   * Note: This method only creates entity instances in memory. Use save() to persist them to the database.
   */
  public createInstance<
    T extends
      | DeepPartial<CampaignReportsEntity>
      | DeepPartial<CampaignReportsEntity>[],
  >(
    deepPartial: T,
  ): T extends DeepPartial<CampaignReportsEntity>[]
    ? CampaignReportsEntity[]
    : CampaignReportsEntity {
    if (Array.isArray(deepPartial)) {
      return deepPartial.map(CampaignReportsEntity.create) as any;
    }

    return CampaignReportsEntity.create(deepPartial) as any;
  }

  /**
   * Creates and saves a new CampaignReportsEntity or multiple entities to the database.
   * @param deepPartial - A partial representation of one or more entities.
   * @returns A promise resolving to the saved entity or entities.
   */
  public createAsync(
    deepPartial:
      | DeepPartial<CampaignReportsEntity>
      | DeepPartial<CampaignReportsEntity>[],
  ): Promise<CampaignReportsEntity | CampaignReportsEntity[]> {
    const result = this.createInstance(deepPartial);
    const entities = Array.isArray(result) ? result : [result];
    return this.campaignReportRepository.save(entities);
  }
}
