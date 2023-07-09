import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateChuyenKhoa1682417047942 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chuyenKhoa (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          tenChuyenKhoa VARCHAR(100) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
      `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `chuyenKhoa`");
    }

}
