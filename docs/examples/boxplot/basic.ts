import type { ChartConfiguration } from 'chart.js';
import type {} from '../../../src';

// #region snippet
function randomValues(count: number, min: number, max: number): number[] {
  const delta = max - min;
  return Array.from({ length: count }).map(() => Math.random() * delta + min);
}

const data: ChartConfiguration<'boxplot'>['data'] = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        randomValues(100, 0, 100),
        randomValues(100, 0, 20),
        randomValues(100, 20, 70),
        randomValues(100, 60, 100),
        randomValues(40, 50, 100),
        randomValues(100, 60, 120),
        randomValues(100, 80, 100),
      ],
    },
    {
      label: 'Dataset 2',
      data: [
        randomValues(100, 60, 100),
        randomValues(100, 0, 100),
        randomValues(100, 0, 20),
        randomValues(100, 20, 70),
        randomValues(40, 60, 120),
        randomValues(100, 20, 100),
        randomValues(100, 80, 100),
      ],
    },
  ],
};

const config: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
};
// #endregion snippet

export default config;
