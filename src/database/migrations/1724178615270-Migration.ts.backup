import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724178615270 implements MigrationInterface {
    name = 'Migration1724178615270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_d887e2dcbfe0682c46c055f93d" UNIQUE ("user_id"), CONSTRAINT "PK_56d00ec31dc3eed1c3f6bff4f58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operator_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" text NOT NULL, "operator_id" uuid NOT NULL, CONSTRAINT "REL_a369ea702bcacb2c4c9c1e92dc" UNIQUE ("operator_id"), CONSTRAINT "PK_1dbce03357148af5a2e4fae2752" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operator" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_8b950e1572745d9f69be7748ae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lottery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" character varying(255) NOT NULL DEFAULT 'open', "created_by_operator_id" uuid, "closed_by_operator_id" uuid, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "closedById" uuid, CONSTRAINT "PK_3c80b07e70c62d855b3ebfdd3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lottery_ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" integer NOT NULL, "number" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "lottery_id" uuid NOT NULL, CONSTRAINT "PK_282de3df454e6ead46b50be1b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdrawal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "amount" integer NOT NULL, "operator_id" uuid, "status" character varying(255) NOT NULL DEFAULT 'pending', CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "amount" integer NOT NULL, "operator_id" uuid, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_auth" ADD CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operator_auth" ADD CONSTRAINT "FK_a369ea702bcacb2c4c9c1e92dc3" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery" ADD CONSTRAINT "FK_54249473890998865d025a42f0b" FOREIGN KEY ("created_by_operator_id") REFERENCES "operator"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery" ADD CONSTRAINT "FK_1ca872c29c284c6ae606582bd70" FOREIGN KEY ("closedById") REFERENCES "operator"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery_ticket" ADD CONSTRAINT "FK_ae85ae2834e7c37e0e3f1809b4a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery_ticket" ADD CONSTRAINT "FK_15ec14a938045094e1807dab7c8" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_76c0e76ec51f794d3bfc7f2bc40" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_d5f5ce8abff91d6485c4f84e574" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_934ccd95e5557152309f111df82" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_1efade7977d48cf592d6ea4a84f" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_1efade7977d48cf592d6ea4a84f"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_934ccd95e5557152309f111df82"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_d5f5ce8abff91d6485c4f84e574"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_76c0e76ec51f794d3bfc7f2bc40"`);
        await queryRunner.query(`ALTER TABLE "lottery_ticket" DROP CONSTRAINT "FK_15ec14a938045094e1807dab7c8"`);
        await queryRunner.query(`ALTER TABLE "lottery_ticket" DROP CONSTRAINT "FK_ae85ae2834e7c37e0e3f1809b4a"`);
        await queryRunner.query(`ALTER TABLE "lottery" DROP CONSTRAINT "FK_1ca872c29c284c6ae606582bd70"`);
        await queryRunner.query(`ALTER TABLE "lottery" DROP CONSTRAINT "FK_54249473890998865d025a42f0b"`);
        await queryRunner.query(`ALTER TABLE "operator_auth" DROP CONSTRAINT "FK_a369ea702bcacb2c4c9c1e92dc3"`);
        await queryRunner.query(`ALTER TABLE "user_auth" DROP CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6"`);
        await queryRunner.query(`DROP TABLE "income"`);
        await queryRunner.query(`DROP TABLE "withdrawal"`);
        await queryRunner.query(`DROP TABLE "lottery_ticket"`);
        await queryRunner.query(`DROP TABLE "lottery"`);
        await queryRunner.query(`DROP TABLE "operator"`);
        await queryRunner.query(`DROP TABLE "operator_auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_auth"`);
    }

}
