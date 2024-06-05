import { Test, TestingModule } from '@nestjs/testing';
import { NftImpressionService } from './nft-impression.service';

describe('NftImpressionService', () => {
  let service: NftImpressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftImpressionService],
    }).compile();

    service = module.get<NftImpressionService>(NftImpressionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
