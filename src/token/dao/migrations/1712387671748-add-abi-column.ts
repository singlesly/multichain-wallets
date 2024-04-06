import { MigrationInterface, QueryRunner } from "typeorm";

export class addAbiColumn1712387671748 implements MigrationInterface {
    name = 'addAbiColumn1712387671748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" ADD "abi" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "abi"`);
    }

}
