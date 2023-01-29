import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayments1674432256002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "webhook" text, 
            "group_amount" jsonb NOT NULL, 
            "wallets" jsonb NOT NULL, 
            "order_id" character varying NOT NULL, 
            "paid_network_code" text, 
            "paid_token_symbol" character varying, 
            "paid_amount" jsonb, 
            "recipient_wallet_address" text, 
            "tx_id" text, 
            "payment_date" TIMESTAMP WITH TIME ZONE, 
            "webhook_status" text, 
            "status" text NOT NULL, 
            "declined_reason" text NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "application_id" uuid, 
            CONSTRAINT "UQ_b2f7b823a21562eeca20e72b006" UNIQUE ("order_id"), 
            CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" 
            ADD CONSTRAINT "FK_3b379ebb0e5d8ac17f998b932e7" 
            FOREIGN KEY ("application_id") 
            REFERENCES "applications"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_3b379ebb0e5d8ac17f998b932e7"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
