import { EventName } from '../const';

export interface GetCampaignReportsApiDto {
  to_date: string;
  from_date: string;
  event_name: EventName;
  take?: number;
}
