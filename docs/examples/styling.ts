import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data
function randomValues(count: number, min: number, max: number, extra: number[] = []): number[] {
  const delta = max - min;
  return [...Array.from({ length: count }).map(() => Math.random() * delta + min), ...extra];
}

export const data: ChartConfiguration<'boxplot'>['data'] = {
  labels: ['A'],
  datasets: [
    {
      borderColor: 'green',
      medianColor: 'blue',
      borderWidth: 1,
      outlierRadius: 3,
      itemRadius: 3,
      lowerBackgroundColor: 'lightblue',
      outlierBackgroundColor: '#999999',
      data: [randomValues(100, 1, 9, [14, 16, 0]), randomValues(100, 0, 10)],
    },
  ],
};
// #endregion data
// #region config
export const config: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};
// #endregion config
