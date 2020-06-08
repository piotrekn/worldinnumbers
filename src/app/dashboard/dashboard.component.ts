import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, bufferTime, filter, shareReplay } from 'rxjs/operators';
import { TimeSeries } from '../data/time-series';
import { Ng2ConverterService } from './ng2-converter.service';
import { NgxChart, SharedGroupStatistics, SharedStatistics, NgxValue } from './chart-types';
import { TableRow, Row } from '../data-parser.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Entity, EMPTY_ENTITY } from '../shared/dictionary';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  rawData: Observable<TimeSeries>;
  chart: Observable<any>;

  selectedCountry = new BehaviorSubject<string>(undefined);
  selectiveChart: Observable<string>;
  selectedDataType = 0;

  dataSource: Observable<TableRow[]>;
  matDataSource: Observable<MatTableDataSource<TableRow>>;
  selection = new SelectionModel<TableRow>(true, []);
  displayedColumns: string[] = ['select', 'provinces', 'country', 'confirmed', 'deaths', 'recovered'];
  selectedCountries$ = new BehaviorSubject<Entity<string>>(EMPTY_ENTITY());

  selectChartType = 1;
  charts: {
    ngx?: {
      countries$: Observable<NgxChart<NgxValue>[]>;
    };
  };

  constructor(private dataService: DataService, private converter: Ng2ConverterService) {}

  ngOnInit() {
    const data = this.dataService.get().pipe(shareReplay(1));
    const selectedCountriesData = combineLatest([this.selectedCountries$, data]).pipe(
      map((x) => {
        const [selectedCountries, timeSeries] = x;
        if (selectedCountries?.keys.length === 0) {
          return null;
        }
        const rowPredicate = (row: Row) => {
          return selectedCountries.dictionary[row.country];
        };

        return {
          cssc: {
            confirmed: timeSeries.cssc.confirmed.filter(rowPredicate),
            deaths: timeSeries.cssc.deaths.filter(rowPredicate),
            recovered: timeSeries.cssc.recovered.filter(rowPredicate),
          },
        } as TimeSeries;
      }),
      shareReplay(1)
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
        this.selection = new SelectionModel<TableRow>(true, []);

        // todo should not be subscribed like this
        this.selection.changed
          .pipe(
            bufferTime(1),
            filter((events) => events?.length > 0),
            tap((events) => {
              const entity = { dictionary: {}, keys: events[0].source.selected.map((row) => row.country) } as Entity<
                string
              >;
              entity.dictionary = entity.keys.reduce((p, c) => {
                p[c] = true;
                return p;
              }, {});
              this.selectedCountries$.next(entity);
            })
          )
          .subscribe();

        const mat = new MatTableDataSource(x);

        mat.sort = this.sort;
        mat.paginator = this.paginator;
        return mat;
      }),
      shareReplay(1)
    );

    const ngxCountries$ = selectedCountriesData.pipe(
      map((x) => (x == null ? undefined : this.converter.mapNgxChart(x))),
      shareReplay(1)
      // for log scale add yAxisTickFormatting Math.pow as well
      // tap((x) => x.multi.forEach((m) => m.series.forEach((s) => s.value === Math.log10(s.value)))),
    );

    this.charts = {
      ngx: {
        countries$: ngxCountries$,
      },
    };
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(dataSource: MatTableDataSource<TableRow>) {
    const numSelected = this.selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(dataSource: MatTableDataSource<TableRow>) {
    this.isAllSelected(dataSource)
      ? this.selection.clear()
      : dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(dataSource: MatTableDataSource<TableRow>, row?: TableRow): string {
    if (!row) {
      return `${this.isAllSelected(dataSource) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.country}`;
  }

  applyFilter(dataSource: MatTableDataSource<TableRow>, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }
}
