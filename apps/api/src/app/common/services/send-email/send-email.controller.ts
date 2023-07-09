import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { configService } from 'apps/api/src/config/config.service';



import { SendEmailDto } from './send-email.dto';
import { SendEmailService } from './send-email.service';

@ApiTags('api/send-email')
@Controller('api/send-email')
export class SendEmailController {
  constructor(private sendEmailService: SendEmailService) {}

  @ApiOperation({ summary: 'Test send email' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: SendEmailDto })
  @Post('test')
  async test(@Body() data: SendEmailDto) {
    if (configService.isProduction()) return;

    await this.sendEmailService.send(data);

    return true;
  }
}
