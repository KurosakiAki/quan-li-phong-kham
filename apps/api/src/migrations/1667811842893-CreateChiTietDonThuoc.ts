import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateChiTietDonThuoc1667811842893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chiTietDonThuoc (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          donThuocId BIGINT NULL,
          thuocId BIGINT NULL,
          soLuong INT NOT NULL DEFAULT 1,
          cachDung VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          trangThai VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_don_thuoc_id FOREIGN KEY (donThuocId) REFERENCES donThuoc (id),
          CONSTRAINT fk_thuoc_id FOREIGN KEY (thuocId) REFERENCES thuoc (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `chiTietDonThuoc`");
    }

}
