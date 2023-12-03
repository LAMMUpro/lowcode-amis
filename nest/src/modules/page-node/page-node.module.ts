import { Module } from '@nestjs/common';
import { PageNodeController } from './page-node.controller';
import { PageNodeService } from './page-node.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PageNodeController],
  providers: [
    PageNodeService,
    PrismaService
  ]
})
export class PageNodeModule {}
