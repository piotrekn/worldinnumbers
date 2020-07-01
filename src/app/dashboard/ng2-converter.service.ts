import { Injectable } from '@angular/core';
import { DataType, Row } from '../data-parser.service';
import { TimeSeries } from '../data/time-series';
import { NgxChart, NgxValue } from './chart-types';

@Injectable()
export class Ng2ConverterService {
  static dateFormatCache = new WeakMap();

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

    const mapRow = (row: Row) => {
      const result = {
        name: this.mapColumnName(row),
        series: [],
      } as NgxValue;

      for (const s of row.results) {
        result.series.push({ name: this.dateSerie(s.date), value: s.value });
      }
      return result;
    };

    const localMap = (rows: Row[], dataType: DataType) => {
      const result = {
        ...ngChartBase,
        dataType,
        multi: [],
      } as NgxChart<NgxValue>;

      for (const row of rows) {
        result.multi.push(mapRow(row));
      }
      return result;
    };

    return [
      localMap(timeSeries.cssc.confirmed, DataType.Confirmed),
      localMap(timeSeries.cssc.deaths, DataType.Deaths),
      localMap(timeSeries.cssc.recovered, DataType.Recovered),
    ];
  }

  private dateSerie(date: Date) {
    let formatted = Ng2ConverterService.dateFormatCache.get(date);
    if (!formatted) {
      formatted = date.toLocaleString('default', { month: 'short', day: 'numeric' });
      Ng2ConverterService.dateFormatCache.set(date, formatted);
    }
    return formatted;
  }
}
