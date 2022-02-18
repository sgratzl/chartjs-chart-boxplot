import { Chart, LinearScale, CategoryScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers, Violin, ViolinController } from '../build';

// register controller in chart.js and ensure the defaults are set
Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

const ctx = document.querySelector('canvas').getContext('2d');

const myBar = new Chart(ctx, {
  type: 'boxplot',
  data: {
    labels: ['vs'],
    datasets: [
      {
        label: 'Dataset 1',
        outlierRadius: 10,
        data: [
          [1, 2, 3, 4, 5],
          {
            min: 1,
            q1: 2,
            median: 3,
            q3: 4,
            max: 5,
          },
        ],
      },
    ],
  },
  options: {
    elements: {
      boxplot: {
        outlierRadius: 10,
      },
    },
  },
});

const myViolin = new Chart(ctx, {
  type: 'violin',
  data: {
    labels: ['vs'],
    datasets: [
      {
        label: 'Dataset 1',
        outlierRadius: 10,
        data: [
          [1, 2, 3, 4, 5],
          {
            min: 1,
            q1: 2,
            median: 3,
            q3: 4,
            max: 5,
          },
        ],
      },
    ],
  },
  options: {
    elements: {
      violin: {
        outlierRadius: 10,
      },
    },
  },
});
