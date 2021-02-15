import { TestBed } from '@angular/core/testing';
import { Row } from '../data-parser.service';
import { Ng2ConverterService } from './ng2-converter.service';

describe('Ng2ConverterService', () => {
  let service: Ng2ConverterService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [Ng2ConverterService] });

    service = TestBed.inject(Ng2ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map row', () => {
    const results = [
      { date: new Date(), value: 10 },
      { date: addDays(new Date(), -1), value: 5 },
      { date: addDays(new Date(), -2), value: 1 },
    ];
    expect(service.mapColumnName({ results, country: 'Country' } as Row)).toBe('Country');
    expect(service.mapColumnName({ results, country: 'Country', province: 'Province' } as Row)).toBe(
      'Country, Province'
    );
  });

  // todo
  // it('should map lines to NgxChart', () => {
  //   const data = service.mapNgxChart(TestBed.inject(DataParserService).parseAll(TIME_SERIES));
  //   expect(data.length).toBeGreaterThan(3);
  //   data.forEach((s) => expect(s.multi.length).toBeGreaterThan(0));
  // });

  it('should transpose', () => {
    const array = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const expectedArray = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ];
    const data = service.transpose(array);
    expect(data).toEqual(expectedArray);
  });

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
});
