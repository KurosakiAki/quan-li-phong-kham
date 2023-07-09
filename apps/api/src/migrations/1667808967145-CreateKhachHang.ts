import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateKhachHang1667808967145 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS khachHang (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          userId INT(11) UNSIGNED NULL,
          fullname VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          referenceId VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          birthday DATETIME NULL DEFAULT NULL,
          gender VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          email VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          phone VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          address VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_kh_user_id FOREIGN KEY (userId) REFERENCES user (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `khachHang`");
    }

}
