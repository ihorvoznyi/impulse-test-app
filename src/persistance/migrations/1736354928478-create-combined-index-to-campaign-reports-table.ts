import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCombinedIndexToCampaignReportsTable1736354928478 implements MigrationInterface {
    name = 'CreateCombinedIndexToCampaignReportsTable1736354928478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2920a0db71303156c383d9bc92" ON "campaign_report" ("event_time", "client_id", "event_name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2920a0db71303156c383d9bc92"`);
    }

}
