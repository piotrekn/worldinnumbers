import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataParserService } from './data-parser.service';
import { TimeSeries } from './data/time-series';
import { TimeSeriesProvider } from './data/time-series.provider';

@Injectable()
export class DataService {
  constructor(private parser: DataParserService, private timeSeriesProvider: TimeSeriesProvider) {}

  get(): Observable<TimeSeries> {
    return this.timeSeriesProvider.getTimeSeries().pipe(map((timeSeries) => this.parser.parseAll(timeSeries)));
  }
}
