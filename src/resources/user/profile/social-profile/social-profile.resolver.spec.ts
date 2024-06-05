import { Test, TestingModule } from '@nestjs/testing';
import { SocialProfileResolver } from './social-profile.resolver';
import { SocialProfileService } from './social-profile.service';

describe('SocialProfileResolver', () => {
  let resolver: SocialProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialProfileResolver, SocialProfileService],
    }).compile();

    resolver = module.get<SocialProfileResolver>(SocialProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
