import { Component, OnInit, Input } from '@angular/core';
import { NgxChart } from 'src/app/dashboard2/chart-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss'],
})
export class ChartAreaComponent implements OnInit {
  @Input() selectChartType: number;
  @Input() countries: Observable<NgxChart>;
  constructor() {}

  ngOnInit() {}
}
