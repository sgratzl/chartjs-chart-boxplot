import {
  registry,
  BarController,
  LineController,
  PointElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
} from 'chart.js';
import { describe, beforeAll, test } from 'vitest';
import createChart from '../__tests__/createChart';
import { BoxPlotController, BoxPlotDataPoint } from './BoxPlotController';
import { Samples } from './__tests__/utils';
import { BoxAndWiskers } from '../elements';

const options = {
  options: {
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  },
};

describe('boxplot', () => {
  beforeAll(() => {
    registry.addControllers(BoxPlotController, BarController, LineController);
    registry.addElements(BoxAndWiskers, PointElement, BarElement, LineElement);
    registry.addScales(CategoryScale, LinearScale, LogarithmicScale);
  });

  test('default', () => {
    const samples = new Samples(10);

    const chart = createChart<'boxplot', BoxPlotDataPoint[]>({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierBackgroundColor: '#999999',
            lowerBackgroundColor: '#461e7d',
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('minmax', () => {
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Min = Max',
            data: [
              [10, 20, 30, 40, 60, 80, 100],
              [20, 20, 20],
            ],
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('mediancolor', () => {
    const samples = new Samples(10);
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Dataset 1',
            borderColor: 'green',
            medianColor: 'blue',
            borderWidth: 1,
            outlierRadius: 3,
            itemRadius: 3,
            outlierBackgroundColor: '#999999',
            data: [
              samples.numbers({ count: 100, min: 1, max: 9 }).concat([14, 16, 0]),
              samples.numbers({ count: 100, min: 0, max: 10 }),
            ],
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('logarithmic', () => {
    const samples = new Samples(10);
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
          },
          y: {
            type: 'logarithmic',
            display: false,
          },
        },
      },
    });

    return chart.toMatchImageSnapshot();
  });

  test('items', () => {
    const samples = new Samples(10);

    const chart = createChart<'boxplot', BoxPlotDataPoint[]>({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            itemRadius: 2,
            data: samples.boxplots({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            itemRadius: 2,
            data: samples.boxplotsArray({ count: 7 }),
            outlierBackgroundColor: '#999999',
            lowerBackgroundColor: '#461e7d',
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('hybrid', () => {
    const samples = new Samples(10);

    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Box',
            backgroundColor: 'steelblue',
            data: samples.boxplots({ count: 7 }),
          },
          {
            label: 'Bar',
            type: 'bar',
            backgroundColor: 'red',
            data: samples.numbers({ count: 7, max: 150 }) as any,
          },
          {
            label: 'Line',
            type: 'line',
            data: samples.numbers({ count: 7, max: 150 }) as any,
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('quantiles types 7', () => {
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A'],
        datasets: [
          {
            quantiles: 'quantiles',
            borderColor: 'black',
            data: [[18882.492, 7712.077, 5830.748, 7206.05]],
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('quantiles fivenum', () => {
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A'],
        datasets: [{ quantiles: 'fivenum', borderColor: 'black', data: [[18882.492, 7712.077, 5830.748, 7206.05]] }],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('datalimits', () => {
    const samples = new Samples(10);

    const chart = createChart<'boxplot', BoxPlotDataPoint[]>({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            minStats: 'min',
            maxStats: 'max',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
          {
            label: 'Dataset 2',
            minStats: 'min',
            maxStats: 'max',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('data structures', () => {
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['array', '{boxplot values}', 'with items', 'as outliers'],
        datasets: [
          {
            label: 'Dataset 1',
            minStats: 'min',
            maxStats: 'max',
            backgroundColor: 'rgba(255,0,0,0.2)',
            borderColor: 'red',
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
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });

  test('empty', () => {
    const samples = new Samples(10);
    const chart = createChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Dataset 1',
            minStats: 'min',
            maxStats: 'max',
            borderColor: 'red',
            borderWidth: 1,
            outlierRadius: 3,
            itemRadius: 3,
            outlierBackgroundColor: '#999999',
            data: [[], samples.numbers({ count: 100, min: 0, max: 10 })],
          },
        ],
      },
      ...options,
    });

    return chart.toMatchImageSnapshot();
  });
});
