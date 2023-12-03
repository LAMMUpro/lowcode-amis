
import { ApiProperty } from "@nestjs/swagger";
import { User, Prisma} from "@prisma/client";
import { model2ApiPropertyInit } from "src/utils";

/** 文件名=模块名, 需和Prisma model保持一致 */
const modelName = __filename.match(/([^\/\\]+?)(?:.[^.\/]*)?$/)?.[1];
/** 解析后的模型(JSON格式) */
const model = Prisma.dmmf.datamodel.models.find(item=>item.name==modelName);
/** 模型转swagger @ApiProperty 函数 */
const model2ApiProperty = model2ApiPropertyInit(model);

/** 用户 */
export type UserDto = User;

/** 新增用户 */
export class UserDtoCreate implements Omit<User, 'id'|'sex'|'roleIds'|'isEnable'|'isDeleted'> {
    @ApiProperty(model2ApiProperty('realName', {action: 'create'}))
    realName!: User['realName'];
      
    @ApiProperty(model2ApiProperty('nickName', {action: 'create'}))
    nickName!: User['nickName'];
      
    @ApiProperty(model2ApiProperty('avatar', {action: 'create'}))
    avatar!: User['avatar'];
      
    @ApiProperty(model2ApiProperty('psw', {action: 'create'}))
    psw!: User['psw'];
      
    @ApiProperty(model2ApiProperty('phone', {action: 'create'}))
    phone!: User['phone'];
      
    @ApiProperty(model2ApiProperty('sex', {action: 'create'}))
    sex?: User['sex'];
      
    @ApiProperty(model2ApiProperty('roleIds', {action: 'create'}))
    roleIds?: User['roleIds'];
      
    @ApiProperty(model2ApiProperty('isEnable', {action: 'create'}))
    isEnable?: User['isEnable'];
      
    @ApiProperty(model2ApiProperty('isDeleted', {action: 'create'}))
    isDeleted?: User['isDeleted'];
}

/** 删除用户 */
export class UserDtoDelete implements Pick<User, 'id'> {
    @ApiProperty(model2ApiProperty('id'))
    id!: User['id'];
}

/** 查单个用户 */
export class UserDtoFindUnique implements Pick<User, 'id'> {
    @ApiProperty(model2ApiProperty('id'))
    id!: User['id'];
}

/** 查全部用户 */
export class UserDtoFindAll {
  
}

/** 查分页用户 */
export class UserDtoFindBatch implements PageInfo {
  @ApiProperty({default: 10,description: '每页数据',type: Number,required: true})
  pageSize!: number;

  @ApiProperty({default: 1,description: '当前页,从1开始',type: Number,required: true})
  currentPage!: number;

  @ApiProperty({default: 0,description: '总数(后端返回)',type: Number,required: false})
  totalCount?: number;
}

/** 更新用户 */
export class UserDtoUpdate {
    @ApiProperty(model2ApiProperty('realName'))
    realName?: User['realName'];
      
    @ApiProperty(model2ApiProperty('nickName'))
    nickName?: User['nickName'];
      
    @ApiProperty(model2ApiProperty('avatar'))
    avatar?: User['avatar'];
      
    @ApiProperty(model2ApiProperty('psw'))
    psw?: User['psw'];
      
    @ApiProperty(model2ApiProperty('phone'))
    phone?: User['phone'];
      
    @ApiProperty(model2ApiProperty('sex'))
    sex?: User['sex'];
      
    @ApiProperty(model2ApiProperty('roleIds'))
    roleIds?: User['roleIds'];
      
    @ApiProperty(model2ApiProperty('isEnable'))
    isEnable?: User['isEnable'];
}
