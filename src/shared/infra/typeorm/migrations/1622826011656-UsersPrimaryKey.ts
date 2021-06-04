import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersPrimaryKey1622826011656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createPrimaryKey('users', ['id']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey('users');
  }
}
