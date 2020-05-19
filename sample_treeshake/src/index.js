import { BoxPlotChart } from '../../src';

new BoxPlotChart(document.getElementById('canvas'), {
  data: {
    labels: ['A'],
    datasets: [
      {
        label: 'Test',
        data: [
          Array(100)
            .fill(0)
            .map(() => Math.random()),
        ],
      },
    ],
  },
});
