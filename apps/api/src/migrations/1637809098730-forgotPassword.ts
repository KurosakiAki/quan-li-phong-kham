import { MigrationInterface, QueryRunner } from "typeorm";

export class forgotPassword1637809098730 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        CREATE TABLE forgotPassword (
            id INT NOT NULL AUTO_INCREMENT,
            userId INT NULL DEFAULT NULL,
            token VARCHAR(500) NULL DEFAULT NULL,
            PRIMARY KEY(id)
        )
        COLLATE = 'utf8_general_ci'
        `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
