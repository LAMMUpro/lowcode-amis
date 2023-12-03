import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { AppEnvDtoCreate } from 'src/types/dto/AppEnv';
import { SpaceAppEnvDto } from 'src/types/dtoExt/AppEnv';
import { filterUndefined } from 'src/utils';
import { getDefaultResponse } from 'src/utils/default';

@ApiTags("应用")
@Controller('app-env')
export class ApplicationEnvController {
  constructor(private readonly mysql: PrismaService) {}

  @Post()
  async createAppEnv(@Body() data: AppEnvDtoCreate) {
    const response = getDefaultResponse();
    await this.mysql.appEnv.create({
      data,
    })
    return response;
  }

  @Get()
  async findManyAppEnv(
    @Query('appVersionId') _appVersionId: string,
    @Query('applicationId') _applicationId: string
  ) {
    const response = getDefaultResponse();
    const applicationId = Number(_applicationId);
    const appVersionId = Number(_appVersionId);
    const result = await this.mysql.appEnv.findMany({
      where: filterUndefined({
        appVersionId,
        applicationId,
      })
    })
    response.data = result;
    return response;
  }

  /** 更新应用版本对应的环境，增、删 */
  @Put()
  async updateAppEnv(@Body() data: SpaceAppEnvDto.updateAppEnv) {
    const response = getDefaultResponse();
    /** 查之前的 */
    const appEnvList_old = await this.mysql.appEnv.findMany({
      where: {
        appVersionId: data.appVersionId
      }
    })

    /** 删除 */
    for (let i = 0; i < appEnvList_old.length; i++) {
      const envInfo = appEnvList_old[i];
      await this.mysql.appEnv.update({
        where: {
          id: envInfo.id
        },
        data: {
          appVersionId: 0,
          version: ''
        }
      })
    }

    /** 覆盖 */
    for (let i = 0; i < data.envIdList.length; i++) {
      const envId = data.envIdList[i];
      await this.mysql.appEnv.update({
        where: {
          id: envId
        },
        data: {
          appVersionId: data.appVersionId,
          version: data.version
        }
      })
    }

    return response;
  }

}
