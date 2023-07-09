import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAdmin1682954570197 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS admin (
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
          CONSTRAINT fk_admin_user_id FOREIGN KEY (userId) REFERENCES user (id)
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        `)

        await queryRunner.query(`INSERT INTO admin (userId, referenceId, fullname, phone, email) VALUES (1, 'AD110503001', 'Le Van Admin', '0911234567', 'admin@test.com')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `admin`");
    }

}
