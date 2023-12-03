import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationVersionService } from './application-version.service';

describe('ApplicationVersionService', () => {
  let service: ApplicationVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationVersionService],
    }).compile();

    service = module.get<ApplicationVersionService>(ApplicationVersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
