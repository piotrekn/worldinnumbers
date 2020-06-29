import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { TimeSeriesSource } from './time-series-source';

@Injectable()
export class TimeSeriesProvider {
  private state: Observable<TimeSeriesSource>;

  constructor(private httpClient: HttpClient) {}

  private load(path: string): Observable<string> {
    return this.httpClient.get(path, { responseType: 'text' }).pipe(first());
  }

  getTimeSeries(): Observable<TimeSeriesSource> {
    if (this.state) {
      return this.state;
    }
    const gitHubSourceUrl =
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/';
    this.state = combineLatest([
      this.load(`${gitHubSourceUrl}time_series_covid19_confirmed_global.csv`),
      this.load(`${gitHubSourceUrl}time_series_covid19_deaths_global.csv`),
      this.load(`${gitHubSourceUrl}time_series_covid19_recovered_global.csv`),
    ]).pipe(
      map((combined) => {
        const [confirmed, deaths, recovered] = combined;
        return {
          cssc: {
            confirmed,
            deaths,
            recovered,
          },
        } as TimeSeriesSource;
      }),
      shareReplay()
    );

    return this.state;
  }
}
