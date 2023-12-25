import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from "@nestjs/swagger";

/** 响应对象基本格式 */
export class JsonResponse<T> {
  @ApiProperty({ description: '错误时提示信息' })
  msg!: string;

  @ApiProperty({ description: '响应码 1-正常, -1或者其他则不正常' })
  code!: number;
  
  /** 响应体 */
  data!: T
}

/** 分页对象基本格式 */
export class Pagination {
  @ApiProperty({ description: 'current' })
  current!: number;

  @ApiProperty({ description: 'pageSize' })
  pageSize!: number;
  
  @ApiProperty({ description: 'total' })
  total!: number;
}

/** JSON响应 */
export function ApiJsonResponse<T extends Function>(
  model: T,
) {
  return applyDecorators(
    /** 注入模型 */
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

/** 数组响应 */
export function ApiListResponse<T extends Function>(
  model: T,
) {
  return applyDecorators(
    /** 注入模型 */
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                }
              },
            },
          },
        ],
      },
    }),
  );
};

/** 分页数据响应 */
export function ApiPaginationResponse<T extends Function>(
  model: T,
) {
  return applyDecorators(
    /** 注入模型 */
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(JsonResponse) },
          {
            properties: {
              data: {
                allOf: [
                  {
                    $ref: getSchemaPath(Pagination)
                  },
                  {
                    properties: {
                      list: {
                        type: 'array',
                        items: {
                          $ref: getSchemaPath(model),
                        }
                      },
                    },
                  }
                ]
              }
            }
          },
        ],
      },
    }),
  );
};
