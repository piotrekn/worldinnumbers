import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataParserService } from './data-parser.service';
import { TIME_SERIES } from './data';
import { TimeSeries } from './data/time-series';

@Injectable()
export class DataService {
  constructor(private parser: DataParserService) {}

  get(): Observable<TimeSeries> {
    return of(this.parser.parseAll(TIME_SERIES));
  }
}
