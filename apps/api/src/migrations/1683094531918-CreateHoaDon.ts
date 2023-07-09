import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateHoaDon1683094531918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS hoaDon (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          lichKhamId BIGINT NULL,
          maHoaDon VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          tongTien INT NULL DEFAULT NULL,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_hd_lich_kham_id FOREIGN KEY (lichKhamId) REFERENCES lichKham (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `hoaDon`");
    }

}
