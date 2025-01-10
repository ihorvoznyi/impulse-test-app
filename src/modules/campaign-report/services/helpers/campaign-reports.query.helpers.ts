import { SelectQueryBuilder } from 'typeorm';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignReportsQueryBuilder {
  constructor(
    private readonly campaignReportsRepository: CampaignReportsRepository,
  ) {}

  public buildAggregatedEventsQuery(
    eventName: string,
    startDate: Date,
    endDate: Date,
  ): SelectQueryBuilder<any> {
    return this.campaignReportsRepository
      .createQueryBuilder('campaignReport')
      .select('campaignReport.adId', 'adId')
      .addSelect('campaignReport.eventName', 'eventName')
      .addSelect('DATE(campaignReport.eventTime)', 'eventTime')
      .addSelect('COUNT(*)', 'eventCount')
      .where('campaignReport.eventName = :eventName', { eventName })
      .andWhere('campaignReport.eventTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy(
        'campaignReport.adId, campaignReport.eventName, DATE(campaignReport.eventTime)',
      )
      .orderBy('campaignReport.eventTime', 'DESC');
  }

  public buildAggregatedCountQuery(
    eventName: string,
    startDate: Date,
    endDate: Date,
  ): SelectQueryBuilder<any> {
    return this.campaignReportsRepository
      .createQueryBuilder('campaignReport')
      .select(
        'COUNT(DISTINCT CONCAT(campaignReport.adId, DATE(campaignReport.eventTime)))',
        'count',
      )
      .where('campaignReport.eventName = :eventName', { eventName })
      .andWhere('campaignReport.eventTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
  }
}
