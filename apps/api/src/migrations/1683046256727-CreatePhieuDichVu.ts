import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePhieuDichVu1683046256727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS phieuDichVu (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          lichKhamId BIGINT NULL,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          deletedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          deletedUser INT(11) NULL DEFAULT NULL,
          CONSTRAINT fk_pdv_lich_kham_id FOREIGN KEY (lichKhamId) REFERENCES lichKham (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `phieuDichVu`");
    }

}
