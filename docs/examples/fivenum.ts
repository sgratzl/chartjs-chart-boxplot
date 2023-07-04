import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data
export const data: ChartConfiguration<'boxplot'>['data'] = {
  labels: ['A'],
  datasets: [
    {
      itemRadius: 2,
      borderColor: 'black',
      data: [[18882.492, 7712.077, 5830.748, 7206.05]],
    },
  ],
};
// #endregion data
// #region config
export const configType7: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    quantiles: 'quantiles',
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};
// #endregion config
// #region fivenum
export const configFiveNum: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    quantiles: 'fivenum',
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};
// #endregion fivenum
