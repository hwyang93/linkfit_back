import { Test, TestingModule } from '@nestjs/testing';
import { RecruitService } from './recruit.service';

describe('RecruitService', () => {
  let service: RecruitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitService],
    }).compile();

    service = module.get<RecruitService>(RecruitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
