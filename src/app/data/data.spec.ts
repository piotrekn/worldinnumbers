import { TestBed } from '@angular/core/testing';
import { TIME_SERIES } from '.';

describe('DataParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(TIME_SERIES && TIME_SERIES.cssc && TIME_SERIES.cssc.confirmed).toBeTruthy();
    expect(TIME_SERIES.cssc.confirmed.length).toBeGreaterThan(0);
  });
});
