import type { ChartConfiguration } from 'chart.js';
import type {} from '../../src';
import { data } from './boxplot';

// #region minmax
export const minmax: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    minStats: 'min',
    maxStats: 'max',
  },
};
// #endregion minmax

// #region whiskers
export const whiskers: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    minStats: 'whiskerMin',
    maxStats: 'whiskerMax',
  },
};
// #endregion whiskers

// #region box
export const box: ChartConfiguration<'boxplot'> = {
  type: 'boxplot',
  data,
  options: {
    minStats: 'q1',
    maxStats: 'q3',
  },
};
// #endregion box
