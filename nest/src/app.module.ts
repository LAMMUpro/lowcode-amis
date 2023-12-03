import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DemoModule } from './modules/demo/demo.module';
import { UploadModule } from './modules/upload/upload.module';
import databaseConfig from './config/database.config';
import { PrismaService } from '../prisma/prisma.service';
import { OssService } from './modules/oss.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: '.env', 
      isGlobal: true,
      load: [databaseConfig]
    }),
    UploadModule,
    DemoModule,
    UserModule,
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
