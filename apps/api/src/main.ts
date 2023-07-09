/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = '';
  // app.setGlobalPrefix(globalPrefix);

  // https://docs.nestjs.com/techniques/validation#auto-validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // If set to true, validator will strip validated (returned) object of any properties that do not use any validation decorators.
    transform: true,
  }));

  // swagger
  if (!configService.isProduction()) {
    const options = new DocumentBuilder()
      .setTitle('Sedo - Asset management')
      .setDescription('Sedo - Asset management API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: `Please enter JWT token`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header'
        }
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('apidoc', app, document);
  }

  await app.listen(configService.getPort());
  Logger.log(
    `🚀 Application is running on: http://localhost:${configService.getPort()}`
  );
}

bootstrap();
