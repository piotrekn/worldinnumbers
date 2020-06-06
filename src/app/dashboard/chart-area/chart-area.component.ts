import { Component, Input } from '@angular/core';
import { NgxChart, NgxValue } from 'src/app/dashboard2/chart-types';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss'],
})
export class ChartAreaComponent {
  @Input() set dataSeries(value: number) {
    this.dataSeries$.next(value);
  }
  @Input() set countries(value: NgxChart<NgxValue>[]) {
    this.countries$.next(value);
  }

  private countries$ = new BehaviorSubject<NgxChart<NgxValue>[]>(undefined);
  private dataSeries$ = new BehaviorSubject<number>(0);

  @Input() chartType: number;

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
}
