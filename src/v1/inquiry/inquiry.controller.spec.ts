import { Test, TestingModule } from '@nestjs/testing';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

describe('InquiryController', () => {
  let controller: InquiryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiryController],
      providers: [InquiryService],
    }).compile();

    controller = module.get<InquiryController>(InquiryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
