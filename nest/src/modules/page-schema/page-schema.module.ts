import { Module } from '@nestjs/common';
import { PageSchemaController } from './page-schema.controller';
import { PageSchemaService } from './page-schema.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PageSchemaController],
  providers: [
    PageSchemaService,
    PrismaService
  ]
})
export class PageSchemaModule {}
