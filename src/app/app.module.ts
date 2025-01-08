import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common';
import { CampaignReportModule } from 'src/modules';
import { ImpulseApiAdapterModule } from 'src/modules/http-adapters';

@Module({
  imports: [CommonModule, CampaignReportModule, ImpulseApiAdapterModule],
})
export class AppModule {}
