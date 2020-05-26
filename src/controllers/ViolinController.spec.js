import matchChart from '../__tests__/matchChart';
import { ViolinController } from './ViolinController';
import { Samples } from './__tests__/utils';

describe('violin', () => {
  beforeAll(() => {
    ViolinController.register();
  });
  test('default', () => {
    const samples = new Samples(10);
    return matchChart({
      type: ViolinController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
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
      options: {
        legend: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    });
  });
});
