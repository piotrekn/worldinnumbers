import { TestBed, inject } from '@angular/core/testing';

import { DataParserService } from './data-parser.service';
import { TIME_SERIES } from './data';

describe('DataParserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [DataParserService],
    })
  );

  it('should parse data', inject([DataParserService], (service: DataParserService) => {
    expect(service).toBeTruthy();

    const parsed = service.parseAll(TIME_SERIES);
    expect(parsed.cssc.confirmed.length).toBe(248);
    parsed.cssc.confirmed.forEach((x) => expect(x.results.length).toBe(65));

    expect(parsed.cssc.deaths.length).toBe(248);
    parsed.cssc.deaths.forEach((x) => expect(x.results.length).toBe(65));

    expect(parsed.cssc.recovered.length).toBe(234);
    parsed.cssc.recovered.forEach((x) => expect(x.results.length).toBe(65));
  }));
});
