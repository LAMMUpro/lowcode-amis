## ts类型定义

### ./dto
> 该文件夹由代码生成, 不要在这个文件夹修改内容！！！如果需要扩展类型在./dtoExt里面写
> 文件名必须对应prisma/schema.prisma 的model名
> 因为含有class 和 @ApiProperty, 所以无法使用.d.ts、无法使用命名空间
>
### ./dotExt
> 文件名保持一致, `${model.name}.ts`
> 使用命名空间, `Space${model.name}Dto`