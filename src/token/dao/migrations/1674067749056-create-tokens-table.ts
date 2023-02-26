import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTokensTable1674067749056 implements MigrationInterface {
  name = 'createTokensTable1674067749056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "symbol" character varying NOT NULL, 
            "decimals" integer NOT NULL, 
            "type" text NOT NULL, 
            "contract_address" text, 
            "network_code" character varying, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_a07b6fd80718c8129fa076272ff" 
            FOREIGN KEY ("network_code") REFERENCES "networks"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "FK_a07b6fd80718c8129fa076272ff"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
