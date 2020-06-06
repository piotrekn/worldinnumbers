import { TestBed } from '@angular/core/testing';

import { Ng2ConverterService } from './ng2-converter.service';
import { Row, DataParserService } from '../data-parser.service';
import { TIME_SERIES } from '../data';

describe('Ng2ConverterService', () => {
  let service: Ng2ConverterService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [Ng2ConverterService] });

    service = TestBed.get(Ng2ConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    const results = [
      { date: new Date(), value: 10 },
      { date: addDays(new Date(), -1), value: 5 },
      { date: addDays(new Date(), -2), value: 1 },
    ];
    const mapped = service.mapGoogleData([
      { results, country: 'Country', province: 'ConfirmedProvince' },
      { results, country: 'Country', province: 'DeathsProvince' },
      { results, country: 'Country', province: 'RecoveredProvince' },
    ] as Row[]);
    expect(mapped && mapped.values).toBeTruthy();
    expect(mapped.values && mapped.columns).toBeTruthy();
    expect(mapped.values[1][1]).toBe(5);
    expect(mapped.columns[2]).toBe('Country, DeathsProvince');
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

  it('should map lines', () => {
    const data = service.mapGoogleData(
      TestBed.get<DataParserService>(DataParserService).parseAll(TIME_SERIES).cssc.confirmed
    );
    expect(data.columns.length).toBe(249);
    expect(data.values.length).toBe(65);
  });

  it('should map lines to NgxChart', () => {
    const data = service.mapNgxChart(TestBed.get(DataParserService).parseAll(TIME_SERIES));
    expect(data.length).toBeGreaterThan(3);
    data.forEach((s) => expect(s.multi.length).toBeGreaterThan(0));
  });

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

  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
});
