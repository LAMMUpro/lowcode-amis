import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';
import * as jsyaml from 'js-yaml';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** 
   * swagger
   */
  if (process.env.NODE_ENV==='localhost') {
    const options = new DocumentBuilder()
      // .setTitle('Swagger文档')
      // .setDescription('swagger调试文档')
      .setVersion('1.0')
      .addTag('swagger')
      .build();
    /** document就是openapi对象了 */
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
    /** 转为yaml格式来保存 */
    const yamlDocument = jsyaml.dump(document, {
        skipInvalid: true,
        noRefs: true
    });
    fs.writeFile('./swagger.yaml', yamlDocument, ()=>{console.log('>>>swagger.yaml文档已更新')})
  }
  
  /** 允许跨域 */
  app.enableCors({
    origin: [
      "http://localhost:8020",
      "https://amiseditor.test.lammu.cn"
    ],
    /** 这个参数有什么用途 */
    // credentials: true,
  });
  /** 请求大小限制更改到 */
  app.use(json({limit: '2mb'}));
  await app.listen(9000);
}
bootstrap();
