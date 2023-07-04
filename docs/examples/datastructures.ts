import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data

const data: ChartConfiguration<'boxplot'>['data'] = {
  labels: ['array', '{boxplot values}', 'with items', 'as outliers'],
  datasets: [
    {
      label: 'Dataset 1',
      borderWidth: 1,
      itemRadius: 2,
      itemStyle: 'circle',
      itemBackgroundColor: '#000',
      outlierBackgroundColor: '#000',
      data: [
        [1, 2, 3, 4, 5],
        {
          min: 1,
          q1: 2,
          median: 3,
          q3: 4,
          max: 5,
        },
        {
          min: 1,
          q1: 2,
          median: 3,
          q3: 4,
          max: 5,
          items: [1, 2, 3, 4, 5],
        },
        {
          min: 1,
          q1: 2,
          median: 3,
          q3: 4,
          max: 5,
          outliers: [1, 2, 3, 4, 5],
        },
      ],
    },
  ],
};
// #endregion data

// #region config
export const config: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
};
// #endregion config
