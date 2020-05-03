import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { share, map, switchMap } from 'rxjs/operators';
import { TimeSeries } from '../data/time-series';
import { Ng2ConverterService } from './ng2-converter.service';
import { GoogleChart, NgxChart, SharedGroupStatistics, SharedStatistics } from './chart-types';
import { TableRow, Row } from '../data-parser.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  rawData: Observable<TimeSeries>;
  chart: Observable<any>;

  selectedCountry = new BehaviorSubject<string>(undefined);
  selectiveChart: Observable<string>;

  dataSource: Observable<TableRow[]>;
  matDataSource: Observable<MatTableDataSource<TableRow>>;
  displayedColumns: string[] = ['provinces', 'country', 'confirmed', 'deaths', 'recovered'];

  selectChartType = 1;
  charts: {
    google: {
      countries$: Observable<GoogleChart>;
      googleCountryChart$: Observable<GoogleChart>;
    };
    ngx: {
      countries$: Observable<NgxChart>;
      ngxCountryChart$: Observable<NgxChart>;
    };
  };

  constructor(private dataService: DataService, private converter: Ng2ConverterService) {}

  ngOnInit() {
    const data = this.dataService.get().pipe(share());
    const selectedCountryData = this.selectedCountry.asObservable().pipe(
      switchMap((countryName) =>
        data.pipe(
          map((timeSeries) => ({
            countryName,
            data: {
              cssc: {
                confirmed: timeSeries.cssc.confirmed.filter((c) => c.country === countryName),
                deaths: timeSeries.cssc.deaths.filter((c) => c.country === countryName),
                recovered: timeSeries.cssc.recovered.filter((c) => c.country === countryName),
              },
            } as TimeSeries,
          }))
        )
      ),
      share()
    );
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
      let entry = countryEntry[key] as number;
      if (entry != null) {
        const count = row.results[row.results.length - 1].value;
        entry += count;
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
    this.matDataSource = this.dataSource.pipe(
      map((x) => {
        console.log(x);
        const mat = new MatTableDataSource(x);
        mat.sort = this.sort;
        mat.paginator = this.paginator;
        console.log(mat);
        return mat;
      })
    );
    const countries = data.pipe(map((x) => this.converter.createGoogle(x, 'Confirmed cases')));
    const ngxCountries$ = data.pipe(map((x) => this.converter.mapNgxChart(x)));

    const googleCountryChart$ = selectedCountryData.pipe(
      map((x) => this.converter.createGoogle(x.data, `Confirmed cases in ${x.countryName}`))
    );
    const ngxCountryChart$ = selectedCountryData.pipe(map((x) => this.converter.mapNgxChart(x.data)));

    this.charts = {
      google: {
        countries$: countries,
        googleCountryChart$,
      },
      ngx: {
        countries$: ngxCountries$,
        ngxCountryChart$,
      },
    };
  }
}
