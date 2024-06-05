import { Test, TestingModule } from '@nestjs/testing';
import { CrypterService } from './crypter.service';

describe('CrypterService', () => {
  let service: CrypterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrypterService],
    }).compile();

    service = module.get<CrypterService>(CrypterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
