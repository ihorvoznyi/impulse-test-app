import { Module } from '@nestjs/common';
import { CampaignReportController } from './controllers';
import { CampaignReportService } from './services';
import { CampaignReportScheduler } from './services/campaign-report-scheduler.service';
import { DatabaseModule } from 'src/persistance';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';
import { CampaignReportsRepository } from 'src/persistance/repositories';
import { ImpulseApiAdapterModule } from '../http-adapters';
import { CampaignReportsQueryBuilder } from './services/helpers/campaign-reports.query.helpers';

@Module({
  imports: [
    ImpulseApiAdapterModule,
    DatabaseModule.forFeature([CampaignReportsEntity]),
  ],
  controllers: [CampaignReportController],
  providers: [
    CampaignReportsQueryBuilder,
    CampaignReportService,
    CampaignReportScheduler,
    CampaignReportsRepository,
  ],
})
export class CampaignReportModule {}
