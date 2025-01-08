import { Column, Entity, Index } from 'typeorm';
import { TABLE_NAME } from '../const';
import { BaseEntity } from './base.entity';

@Entity({ name: TABLE_NAME.CAMPAIGN_REPORTS_TABLE })
@Index(['eventTime', 'clientId', 'eventName'], { unique: true })
export class CampaignReportsEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  clientId: string;

  @Column({ type: 'varchar' })
  eventName: string;

  @Column('date')
  eventTime: Date;

  @Column({ type: 'varchar' })
  campaign: string;

  @Column({ type: 'varchar' })
  campaignId: string;

  @Column({ type: 'varchar' })
  ad: string;

  @Column({ type: 'varchar' })
  adId: string;

  @Column({ type: 'varchar' })
  adgroup: string;

  @Column({ type: 'varchar' })
  adgroupId: string;
}
