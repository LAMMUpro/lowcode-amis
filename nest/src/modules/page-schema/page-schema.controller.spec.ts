import { Test, TestingModule } from '@nestjs/testing';
import { PageSchemaController } from './page-schema.controller';

describe('PageSchemaController', () => {
  let controller: PageSchemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageSchemaController],
    }).compile();

    controller = module.get<PageSchemaController>(PageSchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
