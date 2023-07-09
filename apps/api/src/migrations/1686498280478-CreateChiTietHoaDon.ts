import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateChiTietHoaDon1686498280478 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chiTietHoaDon (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          hoaDonId BIGINT NULL,
          thuocId BIGINT NULL,
          dichVuId BIGINT NULL,
          soLuong INT NOT NULL DEFAULT 1,
          thanhTien INT NULL DEFAULT NULL,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_hoa_don_id FOREIGN KEY (hoaDonId) REFERENCES hoaDon (id),
          CONSTRAINT fk_cthd_thuoc_id FOREIGN KEY (thuocId) REFERENCES thuoc (id),
          CONSTRAINT fk_cthd_dich_vu_id FOREIGN KEY (dichVuId) REFERENCES dichVu (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `chiTietHoaDon`");
    }

}
