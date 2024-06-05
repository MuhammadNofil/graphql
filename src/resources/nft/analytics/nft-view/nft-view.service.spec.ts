import { Test, TestingModule } from '@nestjs/testing';
import { NftViewService } from './nft-view.service';

describe('NftViewService', () => {
  let service: NftViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftViewService],
    }).compile();

    service = module.get<NftViewService>(NftViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
