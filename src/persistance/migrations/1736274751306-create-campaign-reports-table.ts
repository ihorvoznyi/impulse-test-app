import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignReportsTable1736274751306
  implements MigrationInterface
{
  name = 'CreateCampaignReportsTable1736274751306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "campaign_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" character varying NOT NULL, "event_name" character varying NOT NULL, "event_time" date NOT NULL, "campaign" character varying NOT NULL, "campaign_id" character varying NOT NULL, "ad" character varying NOT NULL, "ad_id" character varying NOT NULL, "adgroup" character varying NOT NULL, "adgroup_id" character varying NOT NULL, CONSTRAINT "PK_f3dc7801ee5ce2708c73fc27af5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "campaign_report"`);
  }
}
