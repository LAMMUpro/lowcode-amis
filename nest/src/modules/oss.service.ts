import { Injectable, OnModuleInit } from '@nestjs/common';
import * as OSS from 'ali-oss';

@Injectable()
export class OssService {
  client = new OSS({
    // Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: process.env.OSS_Region || 'oss-cn-shenzhen',
    // 建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: process.env.OSS_RAM_AccessKey_ID || '',
    accessKeySecret: process.env.OSS_RAM_AccessKey_Secret || '',
    bucket: process.env.OSS_Bucket || '',
  });
}