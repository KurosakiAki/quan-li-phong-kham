import { MigrationInterface, QueryRunner } from "typeorm"
import { passwordService } from '../app/common/services/password.service';

export class CreateUser1655799209249 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS user (
          id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          userRoleCode VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8_general_ci',
          password VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
          createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NULL DEFAULT NULL,
          updatedUser INT(11) NULL DEFAULT NULL,
          PRIMARY KEY (id) USING BTREE,
          UNIQUE INDEX user_uk (username) USING BTREE
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
      `)

      // Create admin user
      const password = await passwordService.hashPassword('123456')
      await queryRunner.query(`INSERT INTO user (username, userRoleCode, password) VALUES ('admin', 'ADMIN', '${password}')`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user`");
    }

}
