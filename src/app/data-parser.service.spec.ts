import { TestBed, inject } from '@angular/core/testing';

import { DataParserService } from './data-parser.service';
import { TIME_SERIES } from './data';

describe('DataParserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [DataParserService],
    })
  );

  it('should be created', inject([DataParserService], (service: DataParserService) => {
    expect(service).toBeTruthy();
    service.parseAll(TIME_SERIES);
  }));
});
