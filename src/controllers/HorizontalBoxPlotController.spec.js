import matchChart from '../__tests__/matchChart';
import { HorizontalBoxPlotController } from './HorizontalBoxPlotController';
import { Samples } from './__tests__/utils';

describe('horizontal boxplot', () => {
  beforeAll(() => {
    HorizontalBoxPlotController.register();
  });
  test('default', () => {
    const samples = new Samples(10);

    return matchChart({
      type: HorizontalBoxPlotController.id,
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
});
