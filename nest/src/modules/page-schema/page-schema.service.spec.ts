import { Test, TestingModule } from '@nestjs/testing';
import { PageSchemaService } from './page-schema.service';

describe('PageSchemaService', () => {
  let service: PageSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageSchemaService],
    }).compile();

    service = module.get<PageSchemaService>(PageSchemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
