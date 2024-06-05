import { Test, TestingModule } from '@nestjs/testing';
import { ReportProfileResolver } from './report-profile.resolver';
import { ReportProfileService } from './report-profile.service';

describe('ReportProfileResolver', () => {
  let resolver: ReportProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportProfileResolver, ReportProfileService],
    }).compile();

    resolver = module.get<ReportProfileResolver>(ReportProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
