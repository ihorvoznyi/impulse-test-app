import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Environment } from 'src/configs';
import { IImpulseApiResponse } from './interfaces';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GetCampaignReportsApiDto } from './dtos/get-campaign-reports-api.dto';

const ENDPOINTS = {
  CAMPAIGN_REPORTS: `${Environment.IMPULSE_API}/tasks/campaign/reports`,
};

const DEFAULT_TAKE_PER_PAGE = 100;

@Injectable()
export class ImpulseApiAdapter {
  constructor(private readonly httpService: HttpService) {}

  public getCampaignReports(
    params: GetCampaignReportsApiDto | string,
  ): Promise<AxiosResponse<IImpulseApiResponse>> {
    let url = ENDPOINTS.CAMPAIGN_REPORTS;
    let axiosRequestConfig: AxiosRequestConfig;

    if (typeof params === 'string') {
      url = params;
    } else {
      const take = params?.take || DEFAULT_TAKE_PER_PAGE;
      axiosRequestConfig = {
        params: {
          ...params,
          take,
        },
      };
    }

    return this.httpService.axiosRef.get<IImpulseApiResponse>(
      url,
      axiosRequestConfig,
    );
  }
}
