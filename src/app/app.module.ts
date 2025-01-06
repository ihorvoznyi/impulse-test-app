import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common';
import { CampaignReportModule } from 'src/modules';

@Module({
  imports: [CommonModule, CampaignReportModule],
})
export class AppModule {}
