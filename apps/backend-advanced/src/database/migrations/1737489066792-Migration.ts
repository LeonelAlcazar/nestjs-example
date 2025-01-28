import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737489066792 implements MigrationInterface {
    name = 'Migration1737489066792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_52bfb4dd4c028498e3a18fc129" ON "lottery_ticket" ("user_id", "lottery_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_52bfb4dd4c028498e3a18fc129"`);
    }

}
