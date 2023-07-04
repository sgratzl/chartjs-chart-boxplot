import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data
function randomValues(count: number, min: number, max: number, extra: number[] = []): number[] {
  const delta = max - min;
  return [...Array.from({ length: count }).map(() => Math.random() * delta + min), ...extra];
}

const data: ChartConfiguration<'boxplot'>['data'] = {
  labels: ['A', 'B', 'C'],
  datasets: [
    {
      label: 'Box',
      type: 'boxplot',
      data: [randomValues(100, 0, 100), randomValues(100, 0, 20, [110]), randomValues(100, 20, 70)],
    },
    {
      label: 'Bar',
      type: 'bar',
      data: randomValues(3, 0, 150),
    },
    {
      label: 'Line',
      type: 'line',
      data: randomValues(3, 0, 150),
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
