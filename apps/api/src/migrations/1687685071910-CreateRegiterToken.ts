import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRegiterToken1687685071910 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE registerToken (
                id INT NOT NULL AUTO_INCREMENT,
                khachHangId INT NULL DEFAULT NULL,
                token VARCHAR(500) NULL DEFAULT NULL,
                PRIMARY KEY(id)
            )
            COLLATE = 'utf8_general_ci'
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
