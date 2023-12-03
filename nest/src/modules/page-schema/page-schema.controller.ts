import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { PageSchemaDto, PageSchemaDtoUpdate } from 'src/types/dto/PageSchema';
import { getDefaultResponse } from 'src/utils/default';

@ApiTags("页面schema")
@Controller('page-schema')
export class PageSchemaController {
  constructor(private readonly mysql: PrismaService) {}

  @Delete('/:nodeId')
  async deletePageSchema(@Param("nodeId") _nodeId: string) {
    const response = getDefaultResponse();
    const nodeId = Number(_nodeId);
    await this.mysql.$transaction(async (mysql) => {
      await this.mysql.pageNode.update({
        where: {
          id: nodeId
        },
        data: {
          hasSchema: false
        }
      })
      await this.mysql.pageSchema.updateMany({
        where: {
          nodeId,
        },
        data: {
          schema: '',
        }
      })
    })
    
    return response;
  }

  @Get('/:nodeId')
  async findPageSchemaByNodeId(@Param('nodeId') _nodeId: string) {
    const response = getDefaultResponse();
    const nodeId = Number(_nodeId);
    const res = await this.mysql.pageSchema.findMany({
      where: { nodeId }
    })
    if (res.length) {
      response.data = res[0];
    }
    return response;
  }

  @Put('/:id')
  async updateSchema(@Param('id') _nodeId: string, @Body() data: PageSchemaDtoUpdate) {
    const response = getDefaultResponse();
    const nodeId = Number(_nodeId);

    await this.mysql.pageSchema.updateMany({
      where: { nodeId },
      data: {
        schema: data.schema,
      }
    })

    await this.mysql.pageNode.update({
      where: {
        id: nodeId
      },
      data: {
        hasSchema: true
      }
    })

    return response;
  }
}
