# nest模版
> 模版

## 功能清单
- 功能1: 
- 功能2: 

## 工具清单
数据库 - mysql
文件存储 - 阿里云OSS
本地数据库管理工具(非必需) - DBeaver
在线数据库管理工具(非必需) -  https://dms.aliyun.com/?accounttraceid=eb2c16205f144e8eb57462349eb6ed71syaa
数据库生成 - prisma
部署 - serveless
打包工具 - ncc/webpack
linux环境 - wsl(windows下用, 可解决一些问题)

## 代码本地执行环境
node版本 - 16.18.0
包管理器 - yarn
操作系统 - mac

## 重要目录介绍
```yaml
dist # yarn build 产物目录
build # yarn ncc 产物目录
prisma # prisma配置
  - api # 自动生成的api, 供前端使用, yarn generate:api 可重新生成
  - controller # 自动生成的controller, 供后端使用(手动复制), yarn generate:controller 可重新生成
  - dto # !!!自动生成的dto ts类型, 供后端使用(软链接), yarn generate:dto 可重新生成
  - migrations # prisma migrate记录
  - generateApi.ts # 生成api的脚本
  - generateController.ts # 生成controller的脚本
  - generateDto.ts # 生成dto的脚本
  - prisma.service.ts # PrismaService, 供import导入使用
  - schema.dbml # dbdocs生成的dbml
  - schema.prisma # !!!数据库配置
scripts # shell脚本
  - generate_module.sh # yarn generate:module执行的命令
  - s_deploy.sh # 部署脚本, yarn deploy:xxx 执行的命令
  - watchPrismaSchema.ts # yarn watch执行的命令
.env # !!!环境变量
.fcignore # 上传serveless黑名单
.s[.xxx].yaml # !!!serveless部署配置
webpack.config.js # webpack打包配置
```

## 项目配置
### 数据库/OSS配置
**.env(不存在需要手动创建)**
将${xxx}对应改为自己的配置
```env
author=${作者名称}
########################## 公共配置 ##########################

#############################################################
########################## 开发环境 ##########################

DATABASE_URL="mysql://root:${数据库密码}@${数据库ip}:${数据库端口号}/${数据库名}"
## OSS存储
OSS_Region="${OSS地区}"
OSS_Bucket="${OSS桶名}"
OSS_RAM_AccessKey_ID="${OSS密钥ID}"
OSS_RAM_AccessKey_Secret="${OSS密钥}"

#############################################################
########################## 测试环境 ##########################

DATABASE_URL_test="mysql://root:${数据库密码}@${数据库ip}:${数据库端口号}/${数据库名}"
## OSS存储
OSS_Region_test="${OSS地区}"
OSS_Bucket_test="${OSS桶名}"
OSS_RAM_AccessKey_ID_test="${OSS密钥ID}"
OSS_RAM_AccessKey_Secret_test="${OSS密钥}"

#############################################################
########################## 预发环境 ##########################

DATABASE_URL_dev="mysql://root:${数据库密码}@${数据库ip}:${数据库端口号}/${数据库名}"
## OSS存储
OSS_Region_dev="${OSS地区}"
OSS_Bucket_dev="${OSS桶名}"
OSS_RAM_AccessKey_ID_dev="${OSS密钥ID}"
OSS_RAM_AccessKey_Secret_dev="${OSS密钥}"

#############################################################
########################## 正式环境 ##########################

DATABASE_URL_master="mysql://root:${数据库密码}@${数据库ip}:${数据库端口号}/${数据库名}"
## OSS存储
OSS_Region_master="${OSS地区}"
OSS_Bucket_master="${OSS桶名}"
OSS_RAM_AccessKey_ID_master="${OSS密钥ID}"
OSS_RAM_AccessKey_Secret_master="${OSS密钥}"
```

### serveless部署配置
**s.yaml**
```yaml
config:
  region: ${地区} # 例: cn-shenzhen
  serviceName: ${服务英文名} # 例: amis-nest
  serviceDescription: ${服务描述} # 例: amis低代码后端
```
**s.xxx.yaml**
```yaml
config:
  functionName: ${函数名} # 例: env_test
  customDomainName: ${自定义域名} # 例: lowcodebase.test.xxxx.cn (需要到阿里云函数计算配置域名, https)
  certId: ${SSL证书ID} # 例: 11154234
```

## 项目运行前配置

```shell
yarn # 下载依赖
```

```shell
yarn generate # 本地第一次运行的时候，schema.prisma的binaryTargets要切换成对应平台的，不然启动会报错，之后可以固定debian-openssl-1.0.x（服务器）
yarn migrate # 根据schema.prisma 生成数据库
```

```shell
yarn watch # 监控prisma配置, 重新生成其他代码
```

**配置软链接 `/prisma/dto` -> `/src/types/dto` 需改为自己本地的绝对目录**
```shell
ln -s /Users/lammu/Desktop/WorkSpace/workplace-amis/amis-main/nest/prisma/dto /Users/lammu/Desktop/WorkSpace/workplace-amis/amis-main/nest/src/types/dto
```

## 项目运行
```shell
yarn start:dev # 启动时如果连接不上数据库, 会启动失败!
```
后端接口: http://localhost:9000/
数据库dbml预览: https://dbdocs.io/chen_yongchao/lowcode-nest
数据库web: http://localhost:7777/
swagger文档(只在开发环境存在): http://localhost:9000/swagger/
swagger-json导出: http://localhost:9000/swagger-json/
swagger-yaml导出: http://localhost:9000/swagger-yaml/

## 部署
> 多环境配置问题：数据库配置、s.yaml函数名、
需要预先安装`ncc`、`s`
```shell
yarn add ncc -g
```
```shell
s deploy -t s.test.yaml # 不同的yaml对应不同的环境
```

## 软链接映射说明
```tsx
/prisma/dto -> /src/types/dto # 后端需要配置
/dist/src/types/dto -> /其他项目/src/types/dto # 可给前端使用, 需要额外配置下面两个依赖: 
/node_modules/.prisma -> /其他项目/src/types/node_modules/.prisma
/node_modules/@prisma -> /其他项目/src/types/node_modules/@prisma
```
