import { Test, TestingModule } from '@nestjs/testing';
import { CsController } from './cs.controller';
import { CsService } from './cs.service';

describe('CsController', () => {
  let controller: CsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsController],
      providers: [CsService],
    }).compile();

    controller = module.get<CsController>(CsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
