import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateChiTietPhieuDichVu1683093368191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chiTietPhieuDichVu (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          phieuDichVuId BIGINT NULL,
          dichVuId BIGINT NULL,
          trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_phieu_dich_vu_id FOREIGN KEY (phieuDichVuId) REFERENCES phieuDichVu (id),
          CONSTRAINT fk_dich_vu_id FOREIGN KEY (dichVuId) REFERENCES dichVu (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `chiTietPhieuDichVu`");
    }

}
