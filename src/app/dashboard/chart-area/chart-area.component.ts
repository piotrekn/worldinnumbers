import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NgxChart, NgxValue } from 'src/app/dashboard/chart-types';
import { SelectChartType } from '../models/select-chart-type.enum';
import { SelectedDataType } from '../models/selected-data-type.enum';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss'],
})
export class ChartAreaComponent {
  Enums = { SelectChartType };

  private countries$ = new BehaviorSubject<NgxChart<NgxValue>[]>(undefined);
  private dataSeries$ = new BehaviorSubject<number>(0);

  view: [number, number];

  @Input() set dataSeries(value: SelectedDataType) {
    this.dataSeries$.next(value);
  }

  @Input() set countries(value: NgxChart<NgxValue>[]) {
    this.countries$.next(value);
  }

  @Input() chartType: SelectChartType;

  countriesValue$: Observable<NgxChart<NgxValue>> = combineLatest([this.dataSeries$, this.countries$]).pipe(
    map((x) => {
      const [dataSeriesIndex, data] = x;
      if (data == null) {
        return null;
      }
      return data[dataSeriesIndex || 0];
    }),
    shareReplay(1)
  );

  constructor() {
    this.view = [innerWidth / 1.3, 400];
  }
  // view is the variable used to change the chart size (Ex: view = [width, height])
  onResize(event) {
    this.view = [event.target.innerWidth / 1.35, 400];
  }
}
