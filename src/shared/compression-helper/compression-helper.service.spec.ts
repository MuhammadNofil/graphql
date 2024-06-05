import { Test, TestingModule } from '@nestjs/testing';
import { CompressionHelperService } from './compression-helper.service';

describe('CompressionHelperService', () => {
  let service: CompressionHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompressionHelperService],
    }).compile();

    service = module.get<CompressionHelperService>(CompressionHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
