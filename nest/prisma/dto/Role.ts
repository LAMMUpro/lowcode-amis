
import { ApiProperty } from "@nestjs/swagger";
import { Role, Prisma} from "@prisma/client";
import { model2ApiPropertyInit } from "src/utils";

/** 文件名=模块名, 需和Prisma model保持一致 */
const modelName = __filename.match(/([^\/\\]+?)(?:.[^.\/]*)?$/)?.[1];
/** 解析后的模型(JSON格式) */
const model = Prisma.dmmf.datamodel.models.find(item=>item.name==modelName);
/** 模型转swagger @ApiProperty 函数 */
const model2ApiProperty = model2ApiPropertyInit(model);

/** 角色 */
export type RoleDto = Role;

/** 新增角色 */
export class RoleDtoCreate implements Omit<Role, 'id'|'menuIds'|'isDeleted'> {
    @ApiProperty(model2ApiProperty('name', {action: 'create'}))
    name!: Role['name'];
      
    @ApiProperty(model2ApiProperty('describe', {action: 'create'}))
    describe!: Role['describe'];
      
    @ApiProperty(model2ApiProperty('menuIds', {action: 'create'}))
    menuIds?: Role['menuIds'];
      
    @ApiProperty(model2ApiProperty('isDeleted', {action: 'create'}))
    isDeleted?: Role['isDeleted'];
}

/** 删除角色 */
export class RoleDtoDelete implements Pick<Role, 'id'> {
    @ApiProperty(model2ApiProperty('id'))
    id!: Role['id'];
}

/** 查单个角色 */
export class RoleDtoFindUnique implements Pick<Role, 'id'> {
    @ApiProperty(model2ApiProperty('id'))
    id!: Role['id'];
}

/** 查全部角色 */
export class RoleDtoFindAll {
  
}

/** 查分页角色 */
export class RoleDtoFindBatch implements PageInfo {
  @ApiProperty({default: 10,description: '每页数据',type: Number,required: true})
  pageSize!: number;

  @ApiProperty({default: 1,description: '当前页,从1开始',type: Number,required: true})
  currentPage!: number;

  @ApiProperty({default: 0,description: '总数(后端返回)',type: Number,required: false})
  totalCount?: number;
}

/** 更新角色 */
export class RoleDtoUpdate {
    @ApiProperty(model2ApiProperty('name'))
    name?: Role['name'];
      
    @ApiProperty(model2ApiProperty('describe'))
    describe?: Role['describe'];
      
    @ApiProperty(model2ApiProperty('menuIds'))
    menuIds?: Role['menuIds'];
}
