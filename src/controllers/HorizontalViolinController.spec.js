import matchChart from '../__tests__/matchChart';
import { HorizontalViolinController } from './HorizontalViolinController';
import { Samples } from './__tests__/utils';

describe('horizontal violin', () => {
  beforeAll(() => {
    HorizontalViolinController.register();
  });
  test('default', () => {
    const samples = new Samples(10);

    return matchChart({
      type: HorizontalViolinController.id,
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
    });
  });
});
