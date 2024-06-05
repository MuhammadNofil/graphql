import { Test, TestingModule } from '@nestjs/testing';
import { ProfileActivityResolver } from './profile-activity.resolver';
import { ProfileActivityService } from './profile-activity.service';

describe('ProfileActivityResolver', () => {
  let resolver: ProfileActivityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileActivityResolver, ProfileActivityService],
    }).compile();

    resolver = module.get<ProfileActivityResolver>(ProfileActivityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
