import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableOffers1678476453534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "liquidity_wallet_address" character varying NOT NULL, 
        "volume_scaled" character varying NOT NULL, 
        "direction" character varying NOT NULL, 
        "available" boolean NOT NULL, 
        "min_scaled" character varying NOT NULL, 
        "max_scaled" character varying NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "token_id" uuid, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers" ADD CONSTRAINT "FK_baa629dddbead4dd6b894cafbb6" 
            FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers" DROP CONSTRAINT "FK_baa629dddbead4dd6b894cafbb6"`,
    );
    await queryRunner.query(`DROP TABLE "offers"`);
  }
}
