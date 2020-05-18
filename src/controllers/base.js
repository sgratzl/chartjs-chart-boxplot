import {} from 'chart.js';
import { interpolateNumberArray } from '../animation';

export function toFixed(value) {
  const decimals = this._chart.config.options.tooltipDecimals; // inject number of decimals from config
  if (decimals == null || typeof decimals !== 'number' || decimals < 0) {
    return value;
  }
  return value.toFixed(decimals);
}

export const baseDefaults = {
  datasets: {
    animation: {
      numberArray: {
        fn: interpolateNumberArray,
        properties: ['outliers', 'items'],
      },
    },
  },
};

const configKeys = [
  'outlierRadius',
  'itemRadius',
  'itemStyle',
  'itemBackgroundColor',
  'itemBorderColor',
  'outlierColor',
  'medianColor',
  'hitPadding',
  'outlierHitRadius',
  'lowerColor',
];
// const configKeyIsColor = [false, false, false, true, true, true, true, false, false, true];

const array = {
  updateElement(elem, index, reset) {
    const dataset = this.getDataset();
    const custom = elem.custom || {};
    const options = this._elementOptions();

    Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
    const resolve = Chart.helpers.options.resolve;

    // Scriptable options
    const context = {
      chart: this.chart,
      dataIndex: index,
      dataset,
      datasetIndex: this.index,
    };

    configKeys.forEach((item) => {
      elem._model[item] = resolve([custom[item], dataset[item], options[item]], context, index);
    });
  },
  _calculateCommonModel(r, data, container, scale) {
    if (container.outliers) {
      r.outliers = container.outliers.map((d) => scale.getPixelForValue(Number(d)));
    }

    if (Array.isArray(data)) {
      r.items = data.map((d) => scale.getPixelForValue(Number(d)));
    } else if (container.items) {
      r.items = container.items.map((d) => scale.getPixelForValue(Number(d)));
    }
  },
};
