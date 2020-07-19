import matchChart from '../__tests__/matchChart';
import { BoxPlotController } from './BoxPlotController';
import { Samples } from './__tests__/utils';
import { registry } from '@sgratzl/chartjs-esm-facade';
import { BoxAndWiskers } from '../elements';

describe('boxplot', () => {
  beforeAll(() => {
    registry.addControllers(BoxPlotController);
    registry.addElements(BoxAndWiskers);
  });

  test('default', () => {
    const samples = new Samples(10);

    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
            outlierColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierColor: '#999999',
            lowerColor: '#461e7d',
          },
        ],
      },
    });
  });

  test('minmax', () => {
    return matchChart({
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
    });
  });

  test('mediancolor', () => {
    const samples = new Samples(10);
    return matchChart({
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
            outlierColor: '#999999',
            data: [
              samples.numbers({ count: 100, min: 1, max: 9 }).concat([14, 16, 0]),
              samples.numbers({ count: 100, min: 0, max: 10 }),
            ],
          },
        ],
      },
    });
  });

  test('logarithmic', () => {
    const samples = new Samples(10);
    return matchChart({
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
  });

  test('items', () => {
    const samples = new Samples(10);

    return matchChart({
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
            outlierColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            itemRadius: 2,
            data: samples.boxplotsArray({ count: 7 }),
            outlierColor: '#999999',
            lowerColor: '#461e7d',
          },
        ],
      },
    });
  });

  test('hybrid', () => {
    const samples = new Samples(10);

    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Box',
            type: 'boxplot',
            backgroundColor: 'steelblue',
            data: samples.boxplots({ count: 7 }),
          },
          {
            label: 'Bar',
            type: 'bar',
            backgroundColor: 'red',
            data: samples.numbers({ count: 7, max: 150 }),
          },
          {
            label: 'Line',
            type: 'line',
            data: samples.numbers({ count: 7, max: 150 }).map((d) => ({ y: d })),
          },
        ],
      },
    });
  });

  test('quantiles types 7', () => {
    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A'],
        datasets: [
          {
            borderColor: 'black',
            data: [[18882.492, 7712.077, 5830.748, 7206.05]],
          },
        ],
      },
      options: {
        boxplot: {
          datasets: {
            quantiles: 'quantiles',
          },
        },
      },
    });
  });

  test('quantiles fivenum', () => {
    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A'],
        datasets: [
          {
            borderColor: 'black',
            data: [[18882.492, 7712.077, 5830.748, 7206.05]],
          },
        ],
      },
      options: {
        boxplot: {
          datasets: {
            quantiles: 'fivenum',
          },
        },
      },
    });
  });

  test('datalimits', () => {
    const samples = new Samples(10);

    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplots({ count: 7 }),
            outlierColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierColor: '#999999',
          },
        ],
      },
      options: {
        boxplot: {
          datasets: {
            minStats: 'min',
            maxStats: 'max',
          },
        },
      },
    });
  });

  test('datastructures', () => {
    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: ['array', '{boxplot values}', 'with items', 'as outliers'],
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'rgba(255,0,0,0.2)',
            borderColor: 'red',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 10,
            itemRadius: 2,
            itemStyle: 'circle',
            itemBackgroundColor: '#000',
            outlierColor: '#000',
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
      options: {
        boxplot: {
          datasets: {
            minStats: 'min',
            maxStats: 'max',
          },
        },
      },
    });
  });

  test('empty', () => {
    const samples = new Samples(10);
    return matchChart({
      type: BoxPlotController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Dataset 1',
            borderColor: 'red',
            borderWidth: 1,
            outlierRadius: 3,
            itemRadius: 3,
            outlierColor: '#999999',
            data: [[], samples.numbers({ count: 100, min: 0, max: 10 })],
          },
        ],
      },
      options: {
        boxplot: {
          datasets: {
            minStats: 'min',
            maxStats: 'max',
          },
        },
      },
    });
  });
});
