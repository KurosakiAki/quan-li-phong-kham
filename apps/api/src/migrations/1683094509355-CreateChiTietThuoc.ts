import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateChiTietThuoc1683094509355 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chiTietThuoc (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          nhapKhoThuocId BIGINT NULL,
          thuocId BIGINT NULL,
          soLuong INT NOT NULL DEFAULT 1,
          soLuongConLai INT NOT NULL DEFAULT 1,
          giaNhap INT NOT NULL DEFAULT 1,
          ngayHetHan DATETIME NULL DEFAULT NULL,
          tongNhap INT NOT NULL DEFAULT 1,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_nhap_kho_thuoc_id FOREIGN KEY (nhapKhoThuocId) REFERENCES nhapKhoThuoc (id),
          CONSTRAINT fk_ctt_thuoc_id FOREIGN KEY (thuocId) REFERENCES thuoc (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `chiTietThuoc`");
    }

}
