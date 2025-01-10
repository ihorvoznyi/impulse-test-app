import { CampaignReportEvent } from 'src/common/interfaces/campaign-report';

export interface GetCampaignReportsApiDto {
  to_date: string;
  from_date: string;
  event_name: CampaignReportEvent;
  take?: number;
}
