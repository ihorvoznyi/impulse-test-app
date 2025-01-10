import { EVENT_NAME } from 'src/common/const/event-name.const';

export interface ICampaignReport {
  client_id: string;

  event_name: CampaignReportEvent;
  event_time: string;

  campaign: string;
  campaign_id: string;

  ad: string;
  ad_id: string;
  adgroup: string;
  adgroup_id: string;
}

export type CampaignReportEvent = (typeof EVENT_NAME)[keyof typeof EVENT_NAME];
