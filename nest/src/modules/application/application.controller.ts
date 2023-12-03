import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Application } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AppEnvDto, AppEnvDtoCreate } from 'src/types/dto/AppEnv';
import { AppVersionDto, AppVersionDtoCreate } from 'src/types/dto/AppVersion';
import { ApplicationDto, ApplicationDtoCreate, ApplicationDtoUpdate } from 'src/types/dto/Application';
import { PageNodeDtoCreate } from 'src/types/dto/PageNode';
import { getDefaultResponse } from 'src/utils/default';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("应用")
@Controller('application')
export class ApplicationController {
  constructor(private readonly mysql: PrismaService) {}
  
  @Post()
  async createApplication(@Body() data: ApplicationDtoCreate) {
    const response: ApiResponse = getDefaultResponse();
    await this.mysql.$transaction(async (mysql) => {
      const res = await mysql.application.create({ data });
      if (!res.id) return;
      /** 
       * 应用默认版本1.0.0
       */
      const versionData:AppVersionDtoCreate = {
        applicationId: res.id,
        version: '1.0.0',
        isAuditing: false,
        isPass: false,
        auditContent: '',
        isDeleted: false
      };
      const res_version = await mysql.appVersion.create({ data: versionData});
      /** 
       * 应用默认环境test、pre、master
       */
      const envData:AppEnvDtoCreate = {
        applicationId: res.id,
        env: 'test',
        envCh: '测试',
        canDelete: false,
        appVersionId: res_version.id,
        version: '1.0.0',
        isDeleted: false
      };
      await mysql.appEnv.create({ data: envData });
      envData.env = 'pre';
      envData.envCh = '预发';
      await mysql.appEnv.create({ data: envData });
      envData.env = 'master';
      envData.envCh = '正式';
      envData.appVersionId = 0; // 正式环境不绑定版本！
      envData.version = ''; // 正式环境须审核通过才能绑定！
      await mysql.appEnv.create({ data: envData });
      const pageNode: PageNodeDtoCreate = {
        name: 'root',
        nameCh: '根节点',
        describe: '根节点, 有且唯一',
        applicationId: res.id,
        version: '1.0.0'
      };
      await mysql.pageNode.create({
        data: pageNode
      });
    })

    return response;
  }

  @Delete('/:id')
  async deleteApplication(@Param('id') _id: string) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.application.update({
      where: { id },
      data: { isDeleted: true }
    });
    return response;
  }

  @Get()
  async findAllApplication() {
    const response: ApiResponse = getDefaultResponse();
    const applicationList = await this.mysql.application.findMany({
      where: {
        isDeleted: false
      }
    });
    response.data = applicationList;
    return response;
  }

  @Put('/:id')
  async updateApplication(
    @Param('id') _id: string,
    @Body() data: ApplicationDtoUpdate
  ) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.application.update({
      where: {
        id
      },
      data: {
        name: data.name,
        describe: data.describe
      }
    })
    return response;
  }
}
