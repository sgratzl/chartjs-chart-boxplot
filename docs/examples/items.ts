import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';
import { data } from './boxplot';

// #region config
export const config: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    elements: {
      boxplot: {
        itemRadius: 2,
      },
    },
  },
};
// #endregion config
