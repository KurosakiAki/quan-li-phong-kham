import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';

import { Queue } from 'bull';

import { SendEmailDto } from './send-email.dto';

// Producers
@Injectable()
export class SendEmailService {

  constructor(
    @InjectQueue('send-email-queue') private readonly sendEmailQueue: Queue,
  ) {}

  /**
   * Send email
   * @param data
   */
  async send(data: SendEmailDto) {
    await this.sendEmailQueue.add(
      'send-email',
      data,
      { delay: 3000 }  // 3 second delayed
    );
  }
}
