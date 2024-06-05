import { Test, TestingModule } from '@nestjs/testing';
import { ReportNftService } from './report-nft.service';

describe('ReportNftService', () => {
  let service: ReportNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportNftService],
    }).compile();

    service = module.get<ReportNftService>(ReportNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
