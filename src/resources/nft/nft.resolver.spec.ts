import { Test, TestingModule } from '@nestjs/testing';
import { NftResolver } from './nft.resolver';
import { NftService } from './nft.service';

describe('NftResolver', () => {
  let resolver: NftResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftResolver, NftService],
    }).compile();

    resolver = module.get<NftResolver>(NftResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
