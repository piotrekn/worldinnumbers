import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss'],
})
export class ChartAreaComponent implements OnInit {
  @Input() selectChartType: number;
  @Input() countries: any;
  constructor() {}

  ngOnInit() {}
}
