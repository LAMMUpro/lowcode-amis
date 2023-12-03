import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PageNode, PageSchema } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import databaseConfig from 'src/config/database.config';
import { ApiBody, ApiHeader, ApiOperation, ApiProduces, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PageNodeDto, PageNodeDtoCreate, PageNodeDtoUpdate } from 'src/types/dto/PageNode';
import { PageSchemaDto, PageSchemaDtoCreate } from 'src/types/dto/PageSchema';
import { response } from 'express';
import { getDefaultResponse } from 'src/utils/default';

@ApiTags("页面菜单")
@Controller('page-node')
export class PageNodeController {
  constructor(
    private readonly mysql: PrismaService,
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>
  ) {}

  @Post()
  /**
   * 同时新增pageSchema
   */
  @ApiOperation({
    summary: "接口名字",
    description: "接口说明",
  })
  async createPageNode(@Body() data: PageNodeDtoCreate) {
    const response = getDefaultResponse();
    delete (data as {id?:number}).id;
    await this.mysql.$transaction(async (mysql) => {
      const res = await mysql.pageNode.create({
        data
      });
      if (!res.id) return;
      const schemaInfo: PageSchemaDtoCreate = {
        nodeId: res.id,
        schema: '',
        isDeleted: false
      };
      await mysql.pageSchema.create({
        data: schemaInfo
      });
    });
    return response;
  }

  @Delete('/:id')
  async deletePageNode(@Param('id') _id: String) {
    const response = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.$transaction(async (mysql) => {
      await mysql.pageNode.update({
        where: {
          id
        },
        data: {
          isDeleted: true
        }
      })
      await mysql.pageSchema.updateMany({
        where: {
          nodeId: id
        },
        data: {
          isDeleted: true
        }
      })
    })
    return response;
  }

  @Get()
  async findManyPageNode(@Query() queryInfo: {
    applicationId: string
    version: string
  }) {
    const result: any = {
      code: 1,
      status: 0,
      msg: 'ok',
      data: [],
      /** 叶节点 */
      leafIds: [],
      /** 原数组, 平铺结构 */
      originList: []
    };
    const nodeList = await this.mysql.pageNode.findMany({
      where: {
        applicationId: +queryInfo.applicationId,
        version: queryInfo.version,
        isDeleted: false
      }
    });
    result.originList = JSON.parse(JSON.stringify(nodeList));
    const rootNode = nodeList.find(item=>item.parentId===0);
    if (!rootNode) return result;
    const nodes = [rootNode];
    nodes.forEach(item => {
      nodeForEach(item, nodeList, '');
    })
    result.data = nodes;


    function nodeForEach(item, nodeList, prePath) {
      item.value = item.id;
      item.label = item.name;
      item.path = `${prePath}/${item.name}`.replace('/root', '');
      result.originList.find(node=>node.id == item.id).path = item.path;
      item.children = nodeList.filter(node=> node.parentId == item.id);
      /** 页节点, root(parentId=0)不能作为叶节点! */
      if (!item.children.length && item.parentId!==0) result.leafIds.push(item.id);
      item.children.forEach(node => {
        nodeForEach(node, nodeList, item.path);
      })
    }
    return result;
  }

  @Put('/:id')
  async updatePageNode(@Param('id') _id: string, @Body() data: PageNodeDtoUpdate) {
    const response = getDefaultResponse();
    const id = Number(_id);
    delete (data as any).id;
    delete (data as any).isDeleted;
    delete (data as any).version;
    data.parentId = Number(data.parentId);
    await this.mysql.pageNode.update({
      where: {
        id,
      },
      data
    })
    return response;
  }
}



