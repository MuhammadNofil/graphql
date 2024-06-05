import { Test, TestingModule } from '@nestjs/testing';
import { RateNftService } from './rate-nft.service';

describe('RateNftService', () => {
  let service: RateNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateNftService],
    }).compile();

    service = module.get<RateNftService>(RateNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
