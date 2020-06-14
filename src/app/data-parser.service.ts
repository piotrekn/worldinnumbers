import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { TimeSeries } from './data/time-series';
import { TimeSeriesSource } from './data/time-series-source';

@Injectable({
  providedIn: 'root',
})
export class DataParserService {
  constructor(private papa: Papa) {}

  parseAll(source: TimeSeriesSource): TimeSeries {
    return {
      cssc: {
        confirmed: this.parse(source.cssc.confirmed),
        recovered: this.parse(source.cssc.recovered),
        deaths: this.parse(source.cssc.deaths),
      },
    };
  }

  parse(lines: string[]): any {
    const csseData = [...lines];

    const header = csseData.shift().split(',');
    const daysColumnIndex = 4;
    const days = header.slice(daysColumnIndex, header.length).map((x) => new Date(Date.parse(x)));

    const parseResult = this.papa.parse(csseData.join('\n'), { header: false });
    const rows = (parseResult.data as string[][]).map(
      (x) =>
        ({
          province: x[0],
          country: x[1],
          lat: +x[2],
          lang: +x[3],
          results: x.slice(daysColumnIndex, x.length).map(
            (cell, i) =>
              ({
                value: +cell,
                date: days[i],
              } as DailyResult)
          ),
        } as Row)
    );

    return rows;
  }
}

export class Row {
  province: string;
  country: string;
  lat: number;
  lang: number;
  results: DailyResult[];
}

export class DailyResult {
  date: Date;
  value: number;
}

export class TableRow {
  provinces?: string[];
  // province: string;
  country: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export enum DataType {
  Confirmed = 0,
  Deaths,
  Recovered,
}
