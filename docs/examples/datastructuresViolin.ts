import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data

const data: ChartConfiguration<'violin'>['data'] = {
  labels: ['array', '{violin values}', 'with items', 'as outliers'],
  datasets: [
    {
      label: 'Dataset 1',
      borderWidth: 1,
      itemRadius: 2,
      itemStyle: 'circle',
      itemBackgroundColor: '#000',
      outlierBackgroundColor: '#000',
      data: [
        [1, 2, 3, 4, 5, 11],
        {
          median: 4,
          maxEstimate: 10,
          coords: [
            { v: 0, estimate: 0 },
            { v: 2, estimate: 10 },
            { v: 4, estimate: 6 },
            { v: 6, estimate: 7 },
            { v: 8, estimate: 0 },
          ],
        },
        {
          median: 4,
          maxEstimate: 10,
          coords: [
            { v: 0, estimate: 0 },
            { v: 2, estimate: 10 },
            { v: 4, estimate: 6 },
            { v: 6, estimate: 7 },
            { v: 8, estimate: 0 },
          ],
          items: [1, 2, 3, 4, 5],
        },
        {
          median: 4,
          maxEstimate: 10,
          coords: [
            { v: 0, estimate: 0 },
            { v: 2, estimate: 10 },
            { v: 4, estimate: 6 },
            { v: 6, estimate: 7 },
            { v: 8, estimate: 0 },
          ],
          outliers: [11],
        },
      ],
    },
  ],
};
// #endregion data

// #region config
export const config: ChartConfiguration<'violin'> = {
  type: 'violin',
  data,
};
// #endregion config
