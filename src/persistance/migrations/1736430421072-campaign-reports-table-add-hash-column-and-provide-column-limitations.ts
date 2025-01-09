import { MigrationInterface, QueryRunner } from "typeorm";

export class CampaignReportsTableAddHashColumnAndProvideColumnLimitations1736430421072 implements MigrationInterface {
    name = 'CampaignReportsTableAddHashColumnAndProvideColumnLimitations1736430421072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "hash" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD CONSTRAINT "UQ_e5d0ffab86c8484a677aeb49a15" UNIQUE ("hash")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2920a0db71303156c383d9bc92"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "client_id" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "event_name"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "event_name" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "campaign"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "campaign" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "campaign_id" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "ad"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "ad" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "ad_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "ad_id" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "adgroup"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "adgroup" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "adgroup_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "adgroup_id" character varying(64) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2920a0db71303156c383d9bc92" ON "campaign_report" ("event_time", "client_id", "event_name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2920a0db71303156c383d9bc92"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "adgroup_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "adgroup_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "adgroup"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "adgroup" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "ad_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "ad_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "ad"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "ad" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "campaign_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "campaign_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "campaign"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "campaign" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "event_name"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "event_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" ADD "client_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2920a0db71303156c383d9bc92" ON "campaign_report" ("client_id", "event_name", "event_time") `);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP CONSTRAINT "UQ_e5d0ffab86c8484a677aeb49a15"`);
        await queryRunner.query(`ALTER TABLE "campaign_report" DROP COLUMN "hash"`);
    }

}
