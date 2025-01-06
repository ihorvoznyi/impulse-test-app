export interface ICampaignReportResponse {
  ad_id: string;

  query: {
    to_date: string;
    from_date: string;
  };
}
