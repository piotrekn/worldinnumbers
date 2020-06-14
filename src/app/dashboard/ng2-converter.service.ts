import { Injectable } from '@angular/core';
import { TimeSeries } from '../data/time-series';
import { Row, DataType } from '../data-parser.service';
import { NgxChart, NgxValue } from './chart-types';

@Injectable()
export class Ng2ConverterService {
  mapColumnName(row: Row, label?: string): string {
    const regionName = row.province ? `${row.country}, ${row.province}` : row.country;
    return label ? `${label} - ${regionName}` : regionName;
  }

  transpose(array: (string | number)[][]) {
    return array[0].map((_, i) => array.map((row) => row[i]));
  }

  mapNgxChart(timeSeries: TimeSeries): NgxChart<NgxValue>[] {
    const ngChartBase = {
      colorScheme: { domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'] },
      timeline: true,
      legend: true,
      xAxis: true,
      yAxis: true,
      showXAxisLabel: true,
      showYAxisLabel: true,
      showLabels: true,
      view: ['1280', '340'],
    } as NgxChart<NgxValue>;

    const localMap = (rows: Row[], dataType: DataType) => {
      return {
        ...ngChartBase,
        dataType,
        multi: rows.map(
          (row) =>
            ({
              name: this.mapColumnName(row),
              series: row.results.map((result) => ({ name: this.dateSerie(result.date), value: result.value })),
            } as NgxValue)
        ),
      } as NgxChart<NgxValue>;
    };

    return [
      localMap(timeSeries.cssc.confirmed, DataType.Confirmed),
      localMap(timeSeries.cssc.deaths, DataType.Deaths),
      localMap(timeSeries.cssc.recovered, DataType.Recovered),
    ];
  }

  private dateSerie(date: Date) {
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  }
}
