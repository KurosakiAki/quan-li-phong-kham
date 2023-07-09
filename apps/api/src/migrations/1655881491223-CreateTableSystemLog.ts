import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableSystemLog1655881491223 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS systemLog (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          objectType VARCHAR(20) NOT NULL,
          objectId INT(11) NOT NULL,
          type TINYINT NOT NULL,
          changeData TEXT NULL,
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedUserId INT(11) NULL DEFAULT NULL,
          noteId INT NULL DEFAULT NULL
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
      `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `systemLog`");
    }

}
