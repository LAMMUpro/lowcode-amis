import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { AppVersionDtoCreate } from 'src/types/dto/AppVersion';
import { PageNodeDto } from 'src/types/dto/PageNode';
import { SpaceAppVersionDto } from 'src/types/dtoExt/AppVersion';
import { getDefaultResponse } from 'src/utils/default';

@ApiTags("应用")
@Controller('app-version')
export class ApplicationVersionController {
  constructor(private readonly mysql: PrismaService) {}
  
  @Post()
  async createAppVersion(@Body() data: SpaceAppVersionDto.create) {
    const response = getDefaultResponse();

    const exist = await this.mysql.appVersion.findFirst({
      where: {
        applicationId: +data.applicationId,
        version: data.version
      },
    })
    if (exist) {
      response.code = -1;
      response.msg = "该版本号已经存在, 请更改其他版本号!";
      return response;
    }
    
    await this.mysql.$transaction(async (mysql) => {
      const temp = JSON.parse(JSON.stringify(data));
      delete temp.extendVersionId;
      const newVersion = await this.mysql.appVersion.create({data: temp});
      /** 
       * 克隆页面
       */
      let node;
      const oldPageNodeList = await this.mysql.pageNode.findMany({
        where: {
          applicationId: newVersion.applicationId,
          version: (await this.mysql.appVersion.findUnique({where: {id: +data.extendVersionId}}))?.version || '',
          isDeleted: false
        }
      })
      /** 根节点 */
      node = oldPageNodeList.find(item=>item.parentId==0);
      if (!node) throw Error("找不到根节点");
      
      const root = await this.mysql.pageNode.create({
        data: {
          name: 'root',
          nameCh: '根节点',
          describe: '根节点, 有且唯一',
          applicationId: newVersion.applicationId,
          version: newVersion.version
        }
      })

      await this.processChildrenNode(node.id, root.id, oldPageNodeList, newVersion.applicationId, newVersion.version);
    })
    return response;
  }

  async processChildrenNode(oldParentId: number, parentId: number, oldPageNodeList: PageNodeDto[], applicationId: number, version: string) {
    const nodes = oldPageNodeList.filter(item=>item.parentId==oldParentId)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const resNode = await this.mysql.pageNode.create({
        data: {
          name: node.name,
          nameCh: node.nameCh,
          describe: node.describe,
          parentId: parentId,
          applicationId: applicationId,
          version: version,
          hasSchema: node.hasSchema,
        }
      })
      const schemaData = {
        nodeId: resNode.id,
        schema: '',
      }
      if (node.hasSchema) {
        const res = await this.mysql.pageSchema.findFirst({where: {nodeId:node.id}});
        schemaData.schema = res?.schema || '';
      }
      await this.mysql.pageSchema.create({
        data: schemaData
      });
      await this.processChildrenNode(node.id, resNode.id, oldPageNodeList, applicationId, version);
    }
  }

  @Delete('/:id')
  async deleteAppVersion(@Param('id') _id: string) {
    const response = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.appVersion.update({
      where: {
        id
      },
      data: {
        isDeleted: true
      }
    })
    return response;
  }

  @Get()
  async findManyAppVersion(@Query('applicationId') _applicationId: string) {
    const response = getDefaultResponse();
    const applicationId = Number(_applicationId);
    const res = await this.mysql.appVersion.findMany({
      where: {
        applicationId,
        isDeleted: false
      }
    })
    response.data = res;
    return response;
  }

  @Put('/:id')
  async updateAppVersion(@Query('action') action: string, @Param('id') _id: string) {
    if (action!=='verify') return;
    const id = Number(_id);
    const response = getDefaultResponse();
    await this.mysql.appVersion.update({
      where: {
        id,
      },
      data: {
        isAuditing: true,
        isPass: false,
        auditContent: ''
      }
    })
    return response;
  }
}
