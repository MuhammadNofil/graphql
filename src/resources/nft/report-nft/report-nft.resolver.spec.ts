import { Test, TestingModule } from '@nestjs/testing';
import { ReportNftResolver } from './report-nft.resolver';
import { ReportNftService } from './report-nft.service';

describe('ReportNftResolver', () => {
  let resolver: ReportNftResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportNftResolver, ReportNftService],
    }).compile();

    resolver = module.get<ReportNftResolver>(ReportNftResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
