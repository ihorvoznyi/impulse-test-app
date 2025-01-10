import { Injectable } from '@nestjs/common';
import { CampaignReportsEntity } from 'src/persistance/entities/campaign-reports.entity';

@Injectable()
export class CampaignReportResponseMapper {
  public static toResponse(entity: CampaignReportsEntity) {
    return entity;
  }

  public static toResponses(entities: CampaignReportsEntity[]) {
    return entities.map(this.toResponse);
  }
}
