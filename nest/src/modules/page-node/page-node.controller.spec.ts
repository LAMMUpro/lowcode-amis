import { Test, TestingModule } from '@nestjs/testing';
import { PageNodeController } from './page-node.controller';

describe('PageNodeController', () => {
  let controller: PageNodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageNodeController],
    }).compile();

    controller = module.get<PageNodeController>(PageNodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
