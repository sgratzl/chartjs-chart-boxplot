import Theme from 'vitepress/theme';
import { createTypedChart } from 'vue-chartjs';
import { LinearScale, CategoryScale, LogarithmicScale, Tooltip, Title, Legend, Colors } from 'chart.js';
import { BoxAndWiskers, BoxPlotController, Violin, ViolinController } from '../../../';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component(
      'BoxplotChart',
      createTypedChart('boxplot', [
        LinearScale,
        CategoryScale,
        LogarithmicScale,
        BoxAndWiskers,
        BoxPlotController,
        Tooltip,
        Legend,
        Colors,
        Title,
      ])
    );
    app.component(
      'ViolinChart',
      createTypedChart('violin', [
        LinearScale,
        CategoryScale,
        LogarithmicScale,
        Violin,
        ViolinController,
        Tooltip,
        Legend,
        Colors,
        Title,
      ])
    );
  },
};
