import { Test, TestingModule } from '@nestjs/testing';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';

describe('InstructorController', () => {
  let controller: InstructorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorController],
      providers: [InstructorService],
    }).compile();

    controller = module.get<InstructorController>(InstructorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
