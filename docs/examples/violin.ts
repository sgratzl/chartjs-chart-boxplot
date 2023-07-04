import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';

// #region data
export function randomValues(count: number, min: number, max: number, extra: number[] = []): number[] {
  const delta = max - min;
  return [...Array.from({ length: count }).map(() => Math.random() * delta + min), ...extra];
}

export const data: ChartConfiguration<'violin'>['data'] = {
  labels: ['A', 'B', 'C', 'D'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        randomValues(100, 0, 100),
        randomValues(100, 0, 20, [80]),
        randomValues(100, 20, 70),
        // empty data
        [null as unknown as number],
      ],
    },
    {
      label: 'Dataset 2',
      data: [
        randomValues(100, 60, 100, [5, 10]),
        randomValues(100, 0, 100),
        randomValues(100, 0, 20),
        randomValues(100, 20, 40),
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
