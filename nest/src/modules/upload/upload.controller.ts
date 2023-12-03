import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("上传接口")
@Controller('upload')
export class UploadController {}
