import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('会议室预订系统接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于JWT的认证',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  const port = app.get(ConfigService).get('NEST_SERVER_PORT');

  await app.listen(port);
}
bootstrap();
