export interface NgxChart<T> {
  multi: T[];
  view: any[];

  // options
  legend: boolean;
  showLabels: boolean;
  animations: boolean;
  xAxis: boolean;
  yAxis: boolean;
  showYAxisLabel: boolean;
  showXAxisLabel: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  timeline: boolean;
  colorScheme: {
    domain: string[];
  };
}

export interface NgxValue {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
}

export interface SharedStatistics {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface SharedGroupStatistics extends SharedStatistics {
  provinces: { [key: string]: SharedStatistics };
}
