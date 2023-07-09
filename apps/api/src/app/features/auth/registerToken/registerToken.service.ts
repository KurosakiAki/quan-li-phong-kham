import { SystemLogObjectTypeEnum, SystemLogTypeEnum } from '@api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLogService } from '../../system-log/system-log.service';
import {
  CreateRegisterTokenDto,
  UpdateRegisterTokenDto,
} from './registerToken.dto';
import { RegisterToken } from './registerToken.entity';
import { v4 as uuidv4 } from 'uuid';
import { SendEmailService } from '../../../common/services/send-email/send-email.service';
import { configService } from 'apps/api/src/config/config.service';
import { SendEmailDto } from '../../../common/services/send-email/send-email.dto';

@Injectable()
export class RegisterTokenService {
  constructor(
    @InjectRepository(RegisterToken)
    private respository: Repository<RegisterToken>,
    private sendEmailService: SendEmailService
  ) {}

  async registerToken(khachHang: any) {
    const registerToken = await this.respository.findOne({
      where: {
        khachHangId: khachHang.id
      }
    });
    const token = uuidv4();

    if (registerToken) {
      registerToken.token = token;
      await registerToken.save();
    } else {
      const registerTokenUser = this.respository.create({
        khachHangId: khachHang.id,
        token: token
      });

      await registerTokenUser.save();
    }

    this._sendRegisterTokenEmail(khachHang.email, '', token);
    return true;
  }

  _sendRegisterTokenEmail(
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
    )}] Create your account/Tạo tài khoản của bạn`;
    mailData.template = 'email-register';
    mailData.context = {
      token,
      webUrl,
    };

    this.sendEmailService.send(mailData);
  }

  async getToken(token: string) {
    return this.respository.findOne({
      where: {
        token
      }
    });
  }

  /**
   * Xóa registerToken
   * @param id Id registerToken
   * @param deletedUserId Id của khachHang thực hiện thao tác xóa
   */
  async removeToken(token: string) {
    return this.respository.delete({
      token
    })
  }
}
