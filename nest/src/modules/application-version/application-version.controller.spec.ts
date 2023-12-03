import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationVersionController } from './application-version.controller';

describe('ApplicationVersionController', () => {
  let controller: ApplicationVersionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationVersionController],
    }).compile();

    controller = module.get<ApplicationVersionController>(ApplicationVersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
