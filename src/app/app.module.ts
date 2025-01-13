import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common';
import { CampaignReportModule } from 'src/modules';
import { ImpulseApiAdapterModule } from 'src/modules/http-adapters';
import { RateLimitModule } from 'src/modules/libs/rate-limiter';

@Module({
  imports: [
    CommonModule,
    RateLimitModule,
    CampaignReportModule,
    ImpulseApiAdapterModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
