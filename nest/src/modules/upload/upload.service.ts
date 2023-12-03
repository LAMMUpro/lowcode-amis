import { Injectable } from '@nestjs/common';
import { OssService } from '../oss.service';

@Injectable()
export class UploadService {
  constructor(private readonly oss: OssService) {}

  /** 上传单文件, path不要带开头不要带/ */
  async uploadFile(file: Express.Multer.File, path: string) {
    const res = await this.oss.client.put(path, file.buffer);
    console.log('url', res.url);
    return {
      code: 1,
      url: res.url,
      name: path.split('/').slice(-1)
    }
  }


}
