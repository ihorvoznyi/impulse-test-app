import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GetCampaignReportsApiDto } from './dtos';
import { Environment } from 'src/configs';
import { IImpulseApiResponse } from './interfaces';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

const ENDPOINTS = {
  CAMPAIGN_REPORTS: `${Environment.IMPULSE_API}/tasks/campaign/reports`,
};

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
      axiosRequestConfig = {
        params: {
          ...params,
        },
      };
    }

    return this.httpService.axiosRef.get<IImpulseApiResponse>(
      url,
      axiosRequestConfig,
    );
  }
}
