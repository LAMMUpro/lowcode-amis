import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationEnvService } from './application-env.service';

describe('ApplicationEnvService', () => {
  let service: ApplicationEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationEnvService],
    }).compile();

    service = module.get<ApplicationEnvService>(ApplicationEnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
