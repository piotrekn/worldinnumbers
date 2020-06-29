import { inject, TestBed } from '@angular/core/testing';
import { DataParserService } from './data-parser.service';
import { TimeSeriesSource } from './data/time-series-source';

describe('DataParserService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [DataParserService],
    })
  );

  it('should parse data', inject([DataParserService], (service: DataParserService) => {
    expect(service).toBeTruthy();

    const parsed = service.parseAll({
      cssc: {
        confirmed: 'province,country,lat,lang,1/22/20\nnull,a,1,2,3\nb,b,11,12,13',
        deaths: 'province,country,lat,lang,1/22/20\nnull,a,1,2,3\nb,b,11,12,13',
        recovered: 'province,country,lat,lang,1/22/20\nnull,a,1,2,3\nb,b,11,12,13',
      },
    } as TimeSeriesSource);
    expect(parsed.cssc.confirmed.length).toBe(2);
    parsed.cssc.confirmed.forEach((x) => expect(x.results.length).toBe(1));

    expect(parsed.cssc.deaths.length).toBe(parsed.cssc.confirmed.length);
    parsed.cssc.deaths.forEach((x) => expect(x.results.length).toBe(1));

    expect(parsed.cssc.recovered.length).toBe(parsed.cssc.confirmed.length);
    parsed.cssc.recovered.forEach((x) => expect(x.results.length).toBe(1));
  }));
});
