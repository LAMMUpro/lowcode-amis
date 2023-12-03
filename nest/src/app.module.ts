import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DemoModule } from './modules/demo/demo.module';
import { UploadModule } from './modules/upload/upload.module';
import databaseConfig from './config/database.config';
import { PrismaService } from '../prisma/prisma.service';
import { OssService } from './modules/oss.service';
import { UserModule } from './modules/user/user.module';
import { PageNodeModule } from './modules/page-node/page-node.module';
import { PageSchemaModule } from './modules/page-schema/page-schema.module';
import { ApplicationModule } from './modules/application/application.module';
import { ApplicationVersionModule } from './modules/application-version/application-version.module';
import { ApplicationEnvModule } from './modules/application-env/application-env.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: '.env', 
      isGlobal: true,
      load: [databaseConfig]
    }),
    /**
     * 基础功能
     */
    DemoModule,
    UploadModule,
    /**
     * 用户相关
     */
    UserModule,
    /**
     * 页面相关
     */
    PageNodeModule,
    PageSchemaModule,
     /**
      * 应用相关
      */
    ApplicationModule,
    ApplicationVersionModule,
    ApplicationEnvModule,
  ],
  controllers: [
    // UserPostController,
  ],
  providers: [
    PrismaService,
    OssService
  ]
})
export class AppModule {}
