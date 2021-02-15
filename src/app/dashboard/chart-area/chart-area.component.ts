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
  @Input() set dataSeries(value: SelectedDataType) {
    this.dataSeries$.next(value);
  }

  @Input() set countries(value: NgxChart<NgxValue>[]) {
    this.countries$.next(value);
  }

  @Input() chartType: SelectChartType;

  view: [number, number];
  legendPosition = 'below';

  /* eslint-disable */
  Enums = { SelectChartType };

  private countries$ = new BehaviorSubject<NgxChart<NgxValue>[]>(undefined);
  private dataSeries$ = new BehaviorSubject<number>(0);

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

  /* eslint-enable */

  constructor() {
    this.onResize({ target: { innerWidth } });
  }

  onResize(event) {
    const isHigher = event.target.innerWidth >= 550;
    this.legendPosition = isHigher ? 'right' : 'below';
    this.view = [event.target.innerWidth * 0.945, isHigher ? 352 : 298];
  }
}
