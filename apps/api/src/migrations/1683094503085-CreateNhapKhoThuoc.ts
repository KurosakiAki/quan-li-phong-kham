import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateNhapKhoThuoc1683094503085 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS nhapKhoThuoc (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          nhaCungCapId BIGINT NULL,
          maNhapKho VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          tongTien INT NULL DEFAULT NULL,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_nha_cung_cap_id FOREIGN KEY (nhaCungCapId) REFERENCES nhaCungCap (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `nhapKhoThuoc`");
    }

}
