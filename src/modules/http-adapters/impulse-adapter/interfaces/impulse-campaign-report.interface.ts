import { CampaignReportEvent } from 'src/common/interfaces/campaign-report';

export interface IImpulseCampaignReport {
  client_id: string;

  campaign: string;
  campaign_id: string;

  ad: string;
  ad_id: string;
  adgroup: string;
  adgroup_id: string;

  event_time: string;
  event_name: CampaignReportEvent;
}
