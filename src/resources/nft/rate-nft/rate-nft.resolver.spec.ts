import { Test, TestingModule } from '@nestjs/testing';
import { RateNftResolver } from './rate-nft.resolver';
import { RateNftService } from './rate-nft.service';

describe('RateNftResolver', () => {
  let resolver: RateNftResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateNftResolver, RateNftService],
    }).compile();

    resolver = module.get<RateNftResolver>(RateNftResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
