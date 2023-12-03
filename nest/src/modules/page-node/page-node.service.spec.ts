import { Test, TestingModule } from '@nestjs/testing';
import { PageNodeService } from './page-node.service';

describe('PageNodeService', () => {
  let service: PageNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageNodeService],
    }).compile();

    service = module.get<PageNodeService>(PageNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
