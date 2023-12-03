
import { PrismaService } from 'prisma/prisma.service';
import { Controller, Body, Param, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { getDefaultResponse } from 'src/utils/default';
import { UserDtoCreate, UserDtoUpdate } from 'src/types/dto/User';
import { filterUndefined } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly mysql: PrismaService) {}
  
  @Post()
  async createUser(@Body() data: UserDtoCreate) {
    const response: ApiResponse = getDefaultResponse();
    data.sex = Number(data.sex);
    await this.mysql.user.create({ data });
    return response;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') _id: string) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.user.update({
      where: { id },
      data: { isDeleted: true }
    });
    return response;
  }

  @Get()
  async findPageUser(@Query() query: any) {
    console.log(query);
    const response: ApiResponse = getDefaultResponse();
    const userList = await this.mysql.user.findMany({
      where: filterUndefined({
        isDeleted: false,
        nickName: !query.nickName ? undefined : {
          contains: query.nickName
        },
        realName: !query.realName ? undefined : {
          contains: query.realName
        },
        sex: !query.sex ? undefined : Number(query.sex)
      }),
      take: Number(query.pageSize || 10),
      skip: (Number(query.current || 1) - 1 ) * Number(query.pageSize || 10),
    });
    const total = await this.mysql.user.count({
      where: {
        isDeleted: false,
      },
    });

    response.data = {
      list: userList,
      pageSize: Number(query.pageSize || 10),
      current: Number(query.current || 1),
      total: total,
    };
    return response;
  }

  @Put('/:id')
  async updateUser(
    @Param('id') _id: string,
    @Query('action') action: 'updateEnable',
    @Body() data: UserDtoUpdate
  ) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    delete (data as any).id;
    delete (data as any).isDeleted;
    if (action === 'updateEnable') {
      await this.mysql.user.update({
        where: {
          id
        },
        data: {
          isEnable: data.isEnable
        }
      })
    } else {
      await this.mysql.user.update({
        where: {
          id
        },
        data: filterUndefined(data)
      })
    }
    
    return response;
  }
}
