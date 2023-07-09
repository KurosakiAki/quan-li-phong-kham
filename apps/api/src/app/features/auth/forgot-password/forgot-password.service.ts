import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { configService } from 'apps/api/src/config/config.service';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SendEmailDto } from '../../../common/services/send-email/send-email.dto';
import { SendEmailService } from '../../../common/services/send-email/send-email.service';

import { User } from '../../user/user.entity';
import { ForgotPassword } from './forgot-password.entity';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(ForgotPassword) private forgotPasswordRepo: Repository<ForgotPassword>,
    private sendEmailService: SendEmailService,
  ) { }


  async forgotPassword(user: any) {
    const forgotPassword = await this.forgotPasswordRepo.findOne({
      where: {
        userId: user.id
      }
    });
    const token = uuidv4();

    if (forgotPassword) {
      forgotPassword.token = token;
      await forgotPassword.save();
    } else {
      const forgotPasswordUser = this.forgotPasswordRepo.create({
        userId: user.id,
        token: token
      });

      await forgotPasswordUser.save();
    }

    this._sendForgotPasswordEmail(user.email, '', token);
    return true;
  }

  _sendForgotPasswordEmail(
    toEmails: string | string[],
    ccEmails: string | string[],
    token: string
  ) {
    const webUrl = configService.getWebUrl();
    const mailData = new SendEmailDto();
    mailData.to = toEmails;
    mailData.cc = ccEmails;
    mailData.subject = `[${configService.getValue(
      'APP_NAME',
      true,
    )}] Reset your password/Yêu cầu thay đổi mật khẩu`;
    mailData.template = 'email-reset-password';
    mailData.context = {
      token,
      webUrl,
    };

    this.sendEmailService.send(mailData);
  }

  async getToken(token: string) {
    return this.forgotPasswordRepo.findOne({
      where: {
        token
      }
    });
  }

  async removeToken(token: string) {
    return this.forgotPasswordRepo.delete({
      token
    })
  }
}
