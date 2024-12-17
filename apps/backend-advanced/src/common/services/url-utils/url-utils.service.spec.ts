import { Test, TestingModule } from '@nestjs/testing';
import { UrlUtilsService } from './url-utils.service';

describe('UrlUtilsService', () => {
  let service: UrlUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlUtilsService],
    }).compile();

    service = module.get<UrlUtilsService>(UrlUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
