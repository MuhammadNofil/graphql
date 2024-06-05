import { Test, TestingModule } from '@nestjs/testing';
import { BlockProfileResolver } from './block-profile.resolver';
import { BlockProfileService } from './block-profile.service';

describe('BlockProfileResolver', () => {
  let resolver: BlockProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockProfileResolver, BlockProfileService],
    }).compile();

    resolver = module.get<BlockProfileResolver>(BlockProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
