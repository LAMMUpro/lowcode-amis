import { Body, Controller, Get, Header, Headers, Inject, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DemoService } from './demo.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { ApiOperation } from '@nestjs/swagger';
import { getDefaultResponse } from 'src/utils/default';

@Controller('/test')
export class DemoController {
  constructor(
    private readonly demoService: DemoService,
    private readonly configService: ConfigService,
    @Inject(databaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  @Get(['', '/get'])
  @ApiOperation({
    summary: "get请求测试",
    description: "get请求测试",
  })
  getHello(@Query() query): string {
    return this.demoService.getHello(query);
  }

  @Post(['', '/post'])
  @ApiOperation({
    summary: "post请求测试, json格式",
    description: "post请求测试, json格式",
  })
  postHello(@Body() data, @Headers() headers) {
    const response: ApiResponse = getDefaultResponse();
    response.data = {
      originData: data,
      headers,
      timestamp: new Date().getTime(),
    }
    return response;
  }

  /** 
   * 单文件上传, 一个字段上传单文件
   */
  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body('otherKey') otherKey:string) {
    console.log('文件', file);
    console.log('其它值', otherKey);
    return file;
  }

  /** 
   * 多文件上传, 多个字段上传单|多文件
   */
  @Post('/upload-mult-files')
  @UseInterceptors(FileFieldsInterceptor([
    /** 如果文件数大于 maxCount， 请求失败 */
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 2 }
  ]))
  uploadFiless(@UploadedFiles() filesInfo: {file1?: Express.Multer.File[], file2?: Express.Multer.File[]}, @Body('otherKey') otherKey:string) {
    console.log('文件对象', filesInfo);
    console.log('其它值', otherKey);
    return filesInfo;
  }

  /** 
   * 多文件上传, 一个字段上传多文件
   */
  @Post('/upload-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body('otherKey') otherKey:string) {
    console.log('文件数组', files);
    console.log('其它值', otherKey);
    return files;
  }

  /** 
   * 获取相关配置
   */
  @Get('/config')
  useConfig() {
    // console.log('process.env.NODE_ENV', process.env)
    // console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    console.log(this.dbConfig);
    return this.configService;
  }
}
