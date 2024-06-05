import { Test, TestingModule } from '@nestjs/testing';
import { ProfileActivityService } from './profile-activity.service';

describe('ProfileActivityService', () => {
  let service: ProfileActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileActivityService],
    }).compile();

    service = module.get<ProfileActivityService>(ProfileActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
