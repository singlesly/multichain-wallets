import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLoginAndPasswordColumns1675134806121
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "auth_users" WHERE address IS NULL`);
    await queryRunner.query(`ALTER TABLE "auth_users" DROP COLUMN "login"`);
    await queryRunner.query(`ALTER TABLE "auth_users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "auth_users" ALTER COLUMN "address" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_users" ALTER COLUMN "address" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_users" ADD "password" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_users" ADD "login" character varying`,
    );
  }
}
