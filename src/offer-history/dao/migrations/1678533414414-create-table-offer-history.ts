import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableOfferHistory1678533414414
  implements MigrationInterface
{
  name = 'createTableOfferHistory1678533414414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offers_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "base_amount_scaled" character varying NOT NULL, 
        "user_id" uuid NOT NULL, 
        "quote_amount_scaled" character varying NOT NULL, 
        "tx_id" character varying NOT NULL, 
        "direction" character varying NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "token_id" uuid, CONSTRAINT "PK_b77f5f5ea429397b72f3cfc0a52" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "offers_history" ADD CONSTRAINT "FK_e32fcf8c7d737a4d813c4317b53" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offers_history" DROP CONSTRAINT "FK_e32fcf8c7d737a4d813c4317b53"`,
    );
    await queryRunner.query(`DROP TABLE "offers_history"`);
  }
}
