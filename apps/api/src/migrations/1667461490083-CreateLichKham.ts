import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateLichKham1667461490083 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS lichKham (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          tenBenhNhan VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          soDienThoai VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          diaChi VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          thoiGianKham DATETIME NULL DEFAULT NULL,
          lyDo VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
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
      await queryRunner.query("DROP TABLE `lichKham`");
    }

}
