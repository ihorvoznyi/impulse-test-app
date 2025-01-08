import { EventName } from '../const';

export interface GetCampaignReportsApiDto {
  take: number;
  to_date: string;
  from_date: string;
  event_name: EventName;
}
