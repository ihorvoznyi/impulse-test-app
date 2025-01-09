import { Injectable } from '@nestjs/common';
import { DateUtil } from 'src/common/utils/date.util';
import { IImpulseCampaignReport } from 'src/modules/http-adapters/impulse-adapter/interfaces';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ImpulseCompaignReportMapper {
  public static map(
    records: IImpulseCampaignReport[],
  ): DeepPartial<CampaignReportsEntity>[] {
    return records.map((report) => ({
      clientId: report.client_id,
      campaign: report.campaign,
      campaignId: report.campaign_id,
      ad: report.ad,
      adId: report.ad_id,
      adgroup: report.adgroup,
      adgroupId: report.adgroup_id,
      eventName: report.event_name,
      eventTime: DateUtil.parse(report.event_time),
    }));
  }
}
