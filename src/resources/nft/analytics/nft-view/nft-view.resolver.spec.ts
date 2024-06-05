import { Test, TestingModule } from '@nestjs/testing';
import { NftViewResolver } from './nft-view.resolver';
import { NftViewService } from './nft-view.service';

describe('NftViewResolver', () => {
  let resolver: NftViewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftViewResolver, NftViewService],
    }).compile();

    resolver = module.get<NftViewResolver>(NftViewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
