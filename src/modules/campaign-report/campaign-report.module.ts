import { Module } from '@nestjs/common';
import { CampaignReportController } from './controllers';
import { CampaignReportService } from './services';

@Module({
  imports: [],
  controllers: [CampaignReportController],
  providers: [CampaignReportService],
})
export class CampaignReportModule {}
