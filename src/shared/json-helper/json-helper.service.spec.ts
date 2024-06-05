import { Test, TestingModule } from '@nestjs/testing';
import { JsonHelperService } from './json-helper.service';

describe('JsonHelperService', () => {
  let service: JsonHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonHelperService],
    }).compile();

    service = module.get<JsonHelperService>(JsonHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
