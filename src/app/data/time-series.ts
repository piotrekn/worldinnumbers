import { Row } from '../data-parser.service';

export class TimeSeries {
  cssc: {
    confirmed: Row[];
    recovered: Row[];
    deaths: Row[];
  };
}
