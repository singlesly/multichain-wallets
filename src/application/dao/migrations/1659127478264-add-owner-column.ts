import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwnerColumn1659127478264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applications" ADD "owner_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_e57508958bf92b9d9d25231b5e8" FOREIGN KEY ("owner_id") REFERENCES "auth_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_e57508958bf92b9d9d25231b5e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP COLUMN "owner_id"`,
    );
  }
}
