import { Test, TestingModule } from '@nestjs/testing';
import { NftImpressionResolver } from './nft-impression.resolver';
import { NftImpressionService } from './nft-impression.service';

describe('NftImpressionResolver', () => {
  let resolver: NftImpressionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftImpressionResolver, NftImpressionService],
    }).compile();

    resolver = module.get<NftImpressionResolver>(NftImpressionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
