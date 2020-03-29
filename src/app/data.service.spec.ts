import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { DataParserService } from './data-parser.service';
import { Papa } from 'ngx-papaparse';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataService = new DataService(new DataParserService(new Papa()));
    expect(service).toBeTruthy();
  });
});
