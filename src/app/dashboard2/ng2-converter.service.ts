import { Injectable } from '@angular/core';
import { TimeSeries } from '../data/time-series';
import { Row } from '../data-parser.service';
import { GoogleChart, NgxChart } from './chart-types';

@Injectable()
export class Ng2ConverterService {
  constructor() {}

  // baseMapLineChart(timeSeries: TimeSeries): Ng2Chart {
  //   return {
  //     cssc: {
  //       labels: this.collectLabels(timeSeries.cssc.confirmed[0]),
  //       data: [
  //         ...timeSeries.cssc.confirmed.map((x) => this.mapRowToChartDataSet(x, 'Confirmed')),
  //         ...timeSeries.cssc.deaths.map((x) => this.mapRowToChartDataSet(x, 'Deaths')),
  //         ...timeSeries.cssc.recovered.map((x) => this.mapRowToChartDataSet(x, 'Recovered')),
  //       ],
  //     },
  //   };
  // }

  // private collectLabels(row: Row): string[] {
  //   return row.results.map((x) => x.date.toDateString());
  // }

  // mapRowToChartDataSet(row: Row, label?: string): ChartDataSets {
  //   const regionName = row.province ? `${row.country}, ${row.province}` : row.country;
  //   return {
  //     data: row.results.map((r) => r.value),
  //     label: label ? `${label} - ${regionName}` : regionName,
  //   };
  // }

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
    // const tableX = timeSeries.cssc.confirmed.length;
    // const tableY = timeSeries.cssc.confirmed.;
    const columns = ['Date'].concat(row.map((x) => this.mapColumnName(x)));
    // const columns = timeSeries.cssc.confirmed[0].results.map((x) => x.date.toISOString().slice(0, 10));
    const values = row.map((x) => x.results.map((r) => r.value) as (string | number)[]);
    const dates = row[0].results.map((x) => x.date.toDateString()) as (string | number)[];

    const inputData = [dates].concat(values);
    const transposed = this.transpose(inputData);

    return { columns, values: transposed };
  }

  transpose(array: (string | number)[][]) {
    return array[0].map((col, i) => array.map((row) => row[i]));
  }

  mapNgxChart(timeSeries: TimeSeries): NgxChart {
    // // const tableX = timeSeries.cssc.confirmed.length;
    // // const tableY = timeSeries.cssc.confirmed.;
    // const columns = ['Date'].concat(timeSeries.cssc.confirmed.map((x) => this.converter.mapColumnName(x)));
    // // const columns = timeSeries.cssc.confirmed[0].results.map((x) => x.date.toISOString().slice(0, 10));
    // const values = timeSeries.cssc.confirmed.map((x) => x.results.map((r) => r.value) as (string | number)[]);
    // const dates = timeSeries.cssc.confirmed[0].results.map((x) => x.date.toDateString()) as (string | number)[];

    // const inputData = [dates].concat(values);
    // const transposed = this.transpose(inputData);

    const multi = timeSeries.cssc.confirmed.map((x) => ({
      name: this.mapColumnName(x),
      series: x.results.map((v) => ({ name: v.date.toDateString(), value: v.value })),
    }));
    return {
      colorScheme: { domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'] },
      multi,
      timeline: true,
    } as NgxChart;
  }
}
