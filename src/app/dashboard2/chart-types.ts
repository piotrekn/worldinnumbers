export interface GoogleChart {
  title: string;
  type: string;
  data: (string | number)[][];
  columnNames: string[];
  options: {};
  width: number;
  height: number;
}

export interface NgxChart {
  multi: any[];
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

export interface SharedStatistics {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface SharedGroupStatistics extends SharedStatistics {
  provinces: { [key: string]: SharedStatistics };
}
