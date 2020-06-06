import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TimeSeries } from '../data/time-series';
import { Ng2ConverterService } from './ng2-converter.service';
import { NgxChart, SharedGroupStatistics, SharedStatistics, NgxValue } from './chart-types';
import { TableRow, Row } from '../data-parser.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  rawData: Observable<TimeSeries>;
  chart: Observable<any>;

  selectedCountry = new BehaviorSubject<string>(undefined);
  selectiveChart: Observable<string>;

  dataSource: Observable<TableRow[]>;
  displayedColumns: string[] = ['provinces', 'country', 'confirmed', 'deaths', 'recovered'];

  selectChartType = 1;
  charts: {
    ngx?: {
      countries$: Observable<NgxChart<NgxValue>>;
    };
  };

  constructor(private dataService: DataService, private converter: Ng2ConverterService) {}

  ngOnInit() {
    const data = this.dataService.get().pipe(shareReplay(1));
    const addToDictionary = (
      row: Row,
      dictionary: {
        [countryName: string]: SharedGroupStatistics;
      },
      key: string
    ) => {
      let countryEntry: SharedGroupStatistics;
      dictionary[row.country] = countryEntry = dictionary[row.country] || {
        provinces: {},
        confirmed: 0,
        recovered: 0,
        deaths: 0,
      };

      const entry = countryEntry[key];
      if (entry != null) {
        const count = row.results[row.results.length - 1].value;
        countryEntry[key] = countryEntry[key] || 0 + count;
        if (row.province) {
          countryEntry.provinces[row.province] = countryEntry.provinces[row.province] || ({} as SharedStatistics);
          countryEntry.provinces[row.province][key] = count;
        }
      }
      countryEntry[key] = entry;
    };

    this.dataSource = data.pipe(
      map((x) => {
        const countriesDict: {
          [countryName: string]: {
            provinces: { [key: string]: { confirmed: number; deaths: number; recovered: number } };
            confirmed: number;
            deaths: number;
            recovered: number;
          };
        } = {};
        x.cssc.confirmed.forEach((y) => addToDictionary(y, countriesDict, 'confirmed'));
        x.cssc.deaths.forEach((y) => addToDictionary(y, countriesDict, 'deaths'));
        x.cssc.recovered.forEach((y) => addToDictionary(y, countriesDict, 'recovered'));

        return Object.entries(countriesDict).map(
          (dictEntry) =>
            ({
              country: dictEntry[0],
              provinces: Object.keys(dictEntry[1].provinces),
              confirmed: dictEntry[1].confirmed,
              deaths: dictEntry[1].deaths,
              recovered: dictEntry[1].recovered,
            } as TableRow)
        );
      })
    );

    this.charts = {
      ngx: {
        countries$: data.pipe(map((x) => this.converter.mapNgxChart(x))),
      },
    };
  }
}
