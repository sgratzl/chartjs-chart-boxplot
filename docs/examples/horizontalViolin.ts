import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';
import { data } from './violin';

// #region config
export const config: ChartConfiguration<'violin'> = {
  type: 'violin',
  data,
  options: {
    indexAxis: 'y',
  },
};
// #endregion config
