import { registry } from 'chart.js';
import createChart from '../__tests__/createChart';
import { ViolinController } from './ViolinController';
import { Samples } from './__tests__/utils';
import { Violin } from '../elements';

describe('violin', () => {
  beforeAll(() => {
    registry.addControllers(ViolinController);
    registry.addElements(Violin);
  });
  test('default', () => {
    const samples = new Samples(10);
    const chart = createChart({
      type: ViolinController.id,
      data: {
        labels: samples.months({ count: 7 }),
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'red',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
          {
            label: 'Dataset 2',
            backgroundColor: 'blue',
            borderWidth: 1,
            data: samples.boxplotsArray({ count: 7 }),
            outlierBackgroundColor: '#999999',
          },
        ],
      },
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
    });
    return chart.toMatchImageSnapshot();
  });
});
