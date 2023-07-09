import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as entities from '../database/entities-index';
import * as migrations from '../database/migrations-index';

// tslint:disable-next-line: no-var-requires
require('dotenv').config();

class ConfigService {

  rootDir = join(__dirname, '..');
  viewsDir = join(this.rootDir, 'views');

  constructor(private env: { [k: string]: string | undefined }) { }

  public getViewsDir() {
    return this.isProduction() ? this.viewsDir : join(__dirname, '..', '..', 'src', 'views')
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * Get upload size limit in KB
   */
  public getUploadSizeLimit() {
    const limit = this.getValue('UPLOAD_SIZE_LIMIT', false) || 10;
    return Number(limit) * 1024 * 1024;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode !== 'DEV';
  }

  public getWebUrl() {
    return this.isProduction() ? this.getValue('APP_URL', true) : 'http://localhost:4200'
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',

      host: this.getValue('MYSQL_HOST'),
      port: parseInt(this.getValue('MYSQL_PORT'), 10),
      username: this.getValue('MYSQL_USER'),
      password: this.getValue('MYSQL_PASSWORD'),
      database: this.getValue('MYSQL_DATABASE'),

      entities: Object.values(entities),
      // autoLoadEntities: true,

      migrationsTableName: 'migration',

      migrations: Object.values(migrations),
      migrationsRun: true, // Auto run migration when App Start
      // if you want to run manually, you need create ormconfig.json instead get config from this object, then run `npm run typeorm migration:run`
      charset: 'utf8_unicode_ci',
      ssl: false,
      timezone: '+00:00',
      bigNumberStrings: false,
      logging: ['error']
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'MYSQL_HOST',
  ]);

export { configService };
