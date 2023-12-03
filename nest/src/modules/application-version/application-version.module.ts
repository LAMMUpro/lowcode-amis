import { Module } from '@nestjs/common';
import { ApplicationVersionController } from './application-version.controller';
import { ApplicationVersionService } from './application-version.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ApplicationVersionController],
  providers: [
    ApplicationVersionService,
    PrismaService
  ]
})
export class ApplicationVersionModule {}
