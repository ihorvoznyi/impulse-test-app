import { Column, DeepPartial, Entity, Index } from 'typeorm';
import { TABLE_NAME } from '../const';
import { BaseEntity } from './base.entity';
import { CryptoUtil } from 'src/common/utils/crypto.util';

@Entity({ name: TABLE_NAME.CAMPAIGN_REPORTS_TABLE })
@Index(['eventTime', 'clientId', 'eventName'], { unique: true })
export class CampaignReportsEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  clientId: string;

  @Column({ type: 'varchar', length: 64 })
  eventName: string;

  @Column('date')
  eventTime: Date;

  @Column({ type: 'varchar', length: 255 })
  campaign: string;

  @Column({ type: 'varchar', length: 64 })
  campaignId: string;

  @Column({ type: 'varchar', length: 255 })
  ad: string;

  @Column({ type: 'varchar', length: 64 })
  adId: string;

  @Column({ type: 'varchar', length: 255 })
  adgroup: string;

  @Column({ type: 'varchar', length: 64 })
  adgroupId: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  hash: string;

  constructor(partial?: DeepPartial<CampaignReportsEntity>) {
    super();

    if (partial) {
      Object.assign(this, partial);

      if (this.clientId && this.eventName && this.eventTime) {
        this.hash = CampaignReportsEntity.computeHash({
          clientId: this.clientId,
          eventName: this.eventName,
          eventTime: this.eventTime,
        });
      }
    }
  }

  public static create(partial: DeepPartial<CampaignReportsEntity>) {
    return partial ? new CampaignReportsEntity(partial) : {};
  }

  private static computeHash({
    clientId,
    eventName,
    eventTime,
  }: Pick<CampaignReportsEntity, 'clientId' | 'eventName' | 'eventTime'>) {
    const formattedEventTime = eventTime.toISOString().split('T')[0];
    const hashInput = [clientId, eventName, formattedEventTime];
    return CryptoUtil.computeSHA256(hashInput);
  }
}
