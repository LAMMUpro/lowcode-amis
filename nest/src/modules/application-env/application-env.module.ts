import { Module } from '@nestjs/common';
import { ApplicationEnvController } from './application-env.controller';
import { ApplicationEnvService } from './application-env.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ApplicationEnvController],
  providers: [
    ApplicationEnvService,
    PrismaService
  ]
})
export class ApplicationEnvModule {}
