import { ApiPropertyOptions } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

type ActionTypes = 'create'|'delete'|'find'|'findAll'|'update';

/**
 * PrismaModel转swagger @ApiProperty初始化参数
 */
export function model2ApiPropertyInit(model:Prisma.DMMF.Model|undefined) {
  const typeMap = {
    'Int': Number,
    'String': String,
    'Boolean': Boolean,
    'DateTime': String
  }
  return function model2ApiProperty(fieldName: string, options?: ApiPropertyOptions & {action?:ActionTypes}) {
    return {
      description: options?.description ?? model?.fields.find(item=>item.name==fieldName)?.documentation,
      /** TODO default为自增情况！ */
      default: options?.default ?? model?.fields.find(item=>item.name==fieldName)?.default,
      /** TODO外联类型 */
      type: options?.type ?? typeMap[model?.fields.find(item=>item.name==fieldName)?.type as any] ?? String,
      /** TODO应该是外联表才用到 */
      isArray: options?.isArray ?? model?.fields.find(item=>item.name==fieldName)?.isList,
      /** 对应model里面的default，只有创建记录的时候可能为false */
      required: options?.required ?? options?.action == 'create' ? (options?.default ? false : true) : true,
    }
  }
}

/**
 * model转ApiProperty参数
 */
export function generateApiProperty(fields: Prisma.DMMF.Field[], action: ActionTypes, modelName) {
  let result = '';
  if (action==='create')
    fields.filter(item=>item.name!='id')
    .forEach(field=> {
      result += `
    @ApiProperty(model2ApiProperty('${field.name}', {action: 'create'}))
    ${field.name}${field.default==undefined?'!':'?'}: ${modelName}['${field.name}'];
      `;
    })
  if (action==='delete')
    fields.filter(item=>item.name==='id')
    .forEach(field=> {
      result += `
    @ApiProperty(model2ApiProperty('${field.name}'))
    ${field.name}!: ${modelName}['${field.name}'];
      `;
    })
  if (action==='find')
    fields.filter(item=>item.name==='id')
    .forEach(field=> {
      result += `
    @ApiProperty(model2ApiProperty('${field.name}'))
    ${field.name}!: ${modelName}['${field.name}'];
      `;
    })
  if (action==='update')
    fields.filter(item=>!['id', 'isDeleted'].includes(item.name))
    .forEach(field=> {
      result += `
    @ApiProperty(model2ApiProperty('${field.name}'))
    ${field.name}?: ${modelName}['${field.name}'];
      `;
    })
  return result.slice(3, -7);
}

/**
 * 过滤掉对象值为undefined的属性
 */
export function filterUndefined (obj: Object) {
  const result = JSON.parse(JSON.stringify(obj));
  Object.keys(result).forEach(key=> {
    if ([undefined, null, NaN].includes(result[key])) delete result[key];
  })
  return result;
}