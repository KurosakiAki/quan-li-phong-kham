import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { configService } from 'apps/api/src/config/config.service';

import { Job } from 'bull';
import * as nodeMailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { join } from 'path';


import helpers from './mailer.helper';

import { SendEmailDto } from './send-email.dto';

// tslint:disable-next-line: no-var-requires
require('dotenv').config();

// Consumers
@Processor('send-email-queue')
export class SendEmailProcessor {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor() {}

  @Process('send-email')
  async handleTranscode(job: Job<SendEmailDto>) {
    this.logger.debug('Start sending email');

    try {
      const emailTemplatePath = join(__dirname, '/views/mail');

      const transport = nodeMailer.createTransport({
        host: configService.getValue('MAIL_HOST'),
        port: configService.getValue('MAIL_PORT'),
        secure: true, // This option is applying for Gnail account (See more: https://nodemailer.com/smtp/#tls-options)
        auth: {
          // should be replaced with real sender's account
          user: configService.getValue('MAIL_USERNAME'),
          pass: configService.getValue('MAIL_PASSWORD'),
        },
      });

      transport.use(
        'compile',
        hbs({
          viewEngine: {
            helpers: helpers,
            extname: '.hbs',                // handlebars extension
            layoutsDir: emailTemplatePath,  // location of handlebars templates
            defaultLayout: 'template',      // name of main template
            partialsDir: emailTemplatePath, // location of your subtemplates aka. header, footer etc
          },
          viewPath: emailTemplatePath,
          extName: '.hbs',
        }),
      );

      if (job.data.context) {
        job.data.context.appUrl = configService.getValue('APP_URL');
        job.data.context.appName = configService.getValue('APP_NAME');
      }

      return await transport.sendMail({
        ...job.data,
        from: `${configService.getValue(
          'MAIL_FROM_NAME',
        )} <${configService.getValue('MAIL_FROM_ADDRESS')}>`,
      });
    } catch (err) {
      this.logger.error(err, 'Email Trace', 'Email');
    }
  }
}
