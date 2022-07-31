import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletTypeColumn1659227194773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."wallets_type_enum" AS ENUM('1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD "type" "public"."wallets_type_enum" NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."wallets_type_enum"`);
  }
}
