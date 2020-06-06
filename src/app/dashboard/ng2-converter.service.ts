import { Injectable } from '@angular/core';
import { TimeSeries } from '../data/time-series';
import { Row } from '../data-parser.service';
import { GoogleChart, NgxChart } from './chart-types';

@Injectable()
export class Ng2ConverterService {
  mapColumnName(row: Row, label?: string): string {
    const regionName = row.province ? `${row.country}, ${row.province}` : row.country;
    return label ? `${label} - ${regionName}` : regionName;
  }

  createGoogle(timeSeries: TimeSeries, title: string): GoogleChart {
    const rawData = this.mapGoogleData(timeSeries.cssc.confirmed);
    return {
      title,
      type: 'LineChart',
      data: rawData.values,
      columnNames: rawData.columns,
      options: {},
      width: 550,
      height: 400,
    };
  }

  mapGoogleData(row: Row[]): { columns: string[]; values: (string | number)[][] } {
    const columns = ['Date'].concat(row.map((x) => this.mapColumnName(x)));
    const values = row.map((x) => x.results.map((r) => r.value) as (string | number)[]);
    const dates = row[0].results.map((x) => x.date.toDateString()) as (string | number)[];

    const inputData = [dates].concat(values);
    const transposed = this.transpose(inputData);

    return { columns, values: transposed };
  }

  transpose(array: (string | number)[][]) {
    return array[0].map((col, i) => array.map((row) => row[i]));
  }

  mapNgxChart(timeSeries: TimeSeries): NgxChart[] {
    const ngChartBase = {
      colorScheme: { domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'] },
      timeline: true,
      legend: true,
      showXAxisLabel: true,
      showLabels: true,
      showYAxisLabel: true,
      view: ['1280', '340'],
    } as NgxChart;

    return [timeSeries.cssc.confirmed, timeSeries.cssc.deaths, timeSeries.cssc.recovered].map(
      (rows) =>
        ({
          ...ngChartBase,
          multi: rows.map((row) => ({
            name: this.mapColumnName(row),
            series: row.results.map((result) => ({ name: result.date.toDateString(), value: result.value })),
          })),
        } as NgxChart)
    );
  }
}
