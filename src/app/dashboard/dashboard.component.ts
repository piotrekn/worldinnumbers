import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { TimeSeries } from '../data/time-series';

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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const data = this.dataService.get();
    this.rawData = data;
  }
}
