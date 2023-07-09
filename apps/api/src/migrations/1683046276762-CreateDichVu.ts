import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateDichVu1683046276762 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS dichVu (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          tenDichVu VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          donVi VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          donGia INT NULL DEFAULT NULL,
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
        await queryRunner.query("DROP TABLE `dichVu`");
    }

}
