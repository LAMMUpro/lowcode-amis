import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationEnvController } from './application-env.controller';

describe('ApplicationEnvController', () => {
  let controller: ApplicationEnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationEnvController],
    }).compile();

    controller = module.get<ApplicationEnvController>(ApplicationEnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
