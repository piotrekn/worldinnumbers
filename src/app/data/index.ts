import { TimeSeriesSource } from './time-series-source';
import confirmedCases from './time_series_covid19_confirmed_global.json';
import deathCases from './time_series_covid19_deaths_global.json';
import recoveredCases from './time_series_covid19_recovered_global.json';

export const TIME_SERIES: TimeSeriesSource = {
  cssc: {
    confirmed: confirmedCases.rows,
    deaths: deathCases.rows,
    recovered: recoveredCases.rows,
  },
};
