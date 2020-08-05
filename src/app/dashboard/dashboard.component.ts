import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { bufferTime, exhaustMap, filter, map, shareReplay, take, tap } from 'rxjs/operators';
import { Row, TableRow } from '../data-parser.service';
import { DataService } from '../data.service';
import { Dictionary, EMPTY_ENTITY, Entity } from '../shared/dictionary';
import { NgxChart, NgxValue, SharedGroupStatistics, SharedStatistics } from './chart-types';
import { SelectChartType } from './models/select-chart-type.enum';
import { SelectedDataType } from './models/selected-data-type.enum';
import { ValueType } from './models/value-type.enum';
import { Ng2ConverterService } from './ng2-converter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  selectedDataType = SelectedDataType.Confirmed;

  matDataSource: MatTableDataSource<TableRow>;
  dataSource: TableRow[];
  dataSource$: Observable<TableRow[]>;
  matDataSource$: Observable<MatTableDataSource<TableRow>>;
  selection = new SelectionModel<TableRow>(true, []);
  displayedColumns: string[] = ['select', 'country', 'confirmed', 'deaths', 'recovered'];
  private selectedCountries$ = new BehaviorSubject<TableRow[]>([]);
  private selectedCountriesNames$ = new BehaviorSubject<Entity<boolean>>(EMPTY_ENTITY());
  valuesType$ = new BehaviorSubject<ValueType>(ValueType.Daily);

  selectChartType = SelectChartType.Linear;
  valuesType = ValueType.Daily;
  charts: {
    ngx?: {
      countries$: Observable<NgxChart<NgxValue>[]>;
    };
  };

  private subscriptions: Subscription[] = [];

  Enums = { ValueType, SelectChartType, SelectedDataType };

  constructor(
    private dataService: DataService,
    private converter: Ng2ConverterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }

  ngOnInit() {
    const data = this.dataService.get().pipe(shareReplay(1));
    const ngxData$ = data.pipe(
      map((x) => (x == null ? undefined : this.converter.mapNgxChart(x))),
      shareReplay(1)
    );

    const selectedCountriesData = combineLatest([this.valuesType$, this.selectedCountriesNames$, ngxData$]).pipe(
      map((x) => {
        const [valuesType, selectedCountries, chartData] = x;
        if (selectedCountries?.keys.length === 0) {
          return null;
        }

        return chartData
          .map(
            (d) =>
              ({
                ...d,
                multi: this.filterChartData(d.multi, selectedCountries),
              } as NgxChart<NgxValue>)
          )

          .map((d) => {
            if (valuesType === ValueType.Total) {
              return d;
            }
            return { ...d, multi: this.mapValueType(d, valuesType) };
          });
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
        const count = row.results[row.results.length - 1]?.value ?? 0;
        entry += count;
        if (row.province) {
          countryEntry.provinces[row.province] = countryEntry.provinces[row.province] || ({} as SharedStatistics);
          countryEntry.provinces[row.province][key] = count;
        }
      }
      countryEntry[key] = entry;
    };

    this.dataSource$ = data.pipe(
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
      }),
      shareReplay(1)
    );

    this.matDataSource$ = this.dataSource$.pipe(
      map((x) => {
        this.selection = new SelectionModel<TableRow>(true, []);

        // todo should not be subscribed like this
        this.subscriptions.push(
          this.selection.changed
            .pipe(
              bufferTime(1),
              filter((events) => events?.length > 0),
              map((events) => events[0].source.selected),
              tap((selected) => {
                this.selectedCountries$.next(selected);
                this.updateUrlRoute(selected.map((s) => s.country));
              })
            )
            .subscribe()
        );

        const matDataSource = new MatTableDataSource(x);
        matDataSource.sort = this.sort;
        matDataSource.paginator = this.paginator;

        return matDataSource;
      }),
      tap((matDataSource) => (this.matDataSource = matDataSource)),
      shareReplay(1)
    );

    this.route.queryParams
      .pipe(
        exhaustMap((x) => {
          if (!x.countries) {
            return of([]);
          }
          const keys = (x.countries as string).split(',');
          const entity = {
            dictionary: keys.reduce((p, c) => {
              p[c] = true;
              return p;
            }, {} as Dictionary<boolean>),
            keys,
          } as Entity<boolean>;
          this.selectedCountriesNames$.next(entity);

          return this.matDataSource$.pipe(
            filter((chartData) => chartData.data?.length > 0),
            take(1),
            map((source) => source.data.filter((row) => entity.dictionary[row.country])),
            tap((rows) => this.selection.select(...rows))
          );
        })
      )
      .subscribe();

    this.charts = {
      ngx: {
        countries$: selectedCountriesData,
      },
    };
  }

  ngAfterViewInit() {
    this.matDataSource.paginator = this.paginator;
  }

  private mapValueType(d: NgxChart<NgxValue>, valueType: ValueType): NgxValue[] {
    return valueType === ValueType.Daily
      ? d.multi.map((v) => ({
          ...v,
          series: v.series.map((s, i, arr) => ({ ...s, value: s.value - arr[i - 1]?.value || 0 })),
        }))
      : d.multi;
  }

  private updateUrlRoute(countries: string[]) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        countries: countries.length > 0 ? countries.join(',') : null,
      },
    });
  }

  private filterChartData(values: { country?: string }[], selectedCountries: Entity<boolean>) {
    return values.filter((x) => selectedCountries.dictionary[x.country]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(dataSource: MatTableDataSource<TableRow>) {
    const selectedCount = this.selection.selected.length;
    const rowsCount = dataSource?.data?.length ?? 0;
    return selectedCount === rowsCount;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(dataSource: DataSource<TableRow>) {
    const matDataSource = dataSource as MatTableDataSource<TableRow>;
    this.isAllSelected(matDataSource)
      ? this.selection.clear()
      : matDataSource.data.forEach((row) => this.selection.select(row));
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
