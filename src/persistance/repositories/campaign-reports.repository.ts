import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
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

  public findMany(options: FindManyOptions<CampaignReportsEntity>) {
    return this.campaignReportRepository.find(options);
  }

  public async findManyOrFail(options: FindManyOptions<CampaignReportsEntity>) {
    const entities = await this.campaignReportRepository.find(options);
    if (!entities.length) {
      throw new Error(`${CampaignReportsEntity.name} not found`);
    }

    return entities;
  }
}
