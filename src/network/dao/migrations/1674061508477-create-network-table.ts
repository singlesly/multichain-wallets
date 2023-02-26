import { MigrationInterface, QueryRunner } from 'typeorm';

export class СreateNetworkTable1674061508477 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "networks" (
                "code" character varying NOT NULL, 
                "name" character varying NOT NULL, 
                "url" character varying NOT NULL, 
                "kind" text NOT NULL, 
                "options" text NOT NULL DEFAULT '{}', 
                CONSTRAINT "PK_f820172634ddbb5fd48463cb718" PRIMARY KEY ("code")
            )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "networks"`);
  }
}
