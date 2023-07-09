import { MigrationInterface, QueryRunner } from "typeorm";
import { UserRole } from "../app/features/user/user-role/user-role.entity";


export class initDb1619420994856 implements MigrationInterface {
  name = 'initDb1619420994856'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CREATE TABLE
    await queryRunner.query(`
      CREATE TABLE dmUserRole (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL COLLATE 'utf8_general_ci',
        code VARCHAR(200) NOT NULL COLLATE 'utf8_general_ci',
        PRIMARY KEY (id) USING BTREE,
        UNIQUE INDEX code (code) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS note (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        content VARCHAR(500) NULL COLLATE 'utf8_general_ci'
      );
    `)

    // INSERT DATA
    const userRoleRepo = queryRunner.connection.getRepository(UserRole);
    await userRoleRepo.insert([
      {
        id: 1,
        name: 'Quản trị hệ thống',
        code: 'ADMIN'
      },
      {
        id: 2,
        name: 'Bác sĩ',
        code: 'DOCTOR'
      },
      {
        id: 3,
        name: 'Nhân viên',
        code: 'STAFF'
      },
      {
        id: 4,
        name: 'Bệnh nhân',
        code: 'PATIENT'
      }
    ])

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
