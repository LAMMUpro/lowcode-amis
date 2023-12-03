import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ApplicationController],
  providers: [
    ApplicationService, 
    PrismaService // 为什么app.module.ts加了这里还要加?
  ]
})
export class ApplicationModule {}
