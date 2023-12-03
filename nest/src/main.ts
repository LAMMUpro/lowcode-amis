import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** swagger */
  const options = new DocumentBuilder()
    // .setTitle('Swagger文档')
    // .setDescription('swagger调试文档')
    .setVersion('1.0')
    .addTag('swagger')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  /** 允许跨域 */
  app.enableCors({
    /** 不配origin, credentials低代码数据源请求报错!! */
    origin: "*",
    credentials: true,
  });
  /** 请求大小限制更改到 */
  app.use(json({limit: '2mb'}));
  await app.listen(9000);
}
bootstrap();
