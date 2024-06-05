import { Test, TestingModule } from '@nestjs/testing';
import { ReportProfileService } from './report-profile.service';

describe('ReportProfileService', () => {
  let service: ReportProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportProfileService],
    }).compile();

    service = module.get<ReportProfileService>(ReportProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
