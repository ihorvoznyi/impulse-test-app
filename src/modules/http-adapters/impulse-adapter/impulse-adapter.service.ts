import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { GetCampaignReportsApiDto } from './dtos';
import { Environment } from 'src/configs';
import { catchError, firstValueFrom } from 'rxjs';
import { ImpulseApiResponse } from './interfaces';
import { AxiosError, AxiosRequestConfig } from 'axios';

const ENDPOINTS = {
  CAMPAIGN_REPORTS: `${Environment.IMPULSE_API}/tasks/campaign/reports`,
};

@Injectable()
export class ImpulseApiAdapter {
  private readonly logger = new Logger(ImpulseApiAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  public async fetchCampaignReports(
    params: GetCampaignReportsApiDto | string,
  ): Promise<ImpulseApiResponse | never> {
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

    this.logger.debug(axiosRequestConfig);

    const { data } = await firstValueFrom(
      this.httpService.get<ImpulseApiResponse>(url, axiosRequestConfig).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new BadRequestException(error);
        }),
      ),
    );

    return data;
  }
}
