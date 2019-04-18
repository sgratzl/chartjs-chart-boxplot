'use strict';

import * as Chart from 'chart.js';

export const verticalDefaults = {
  scales: {
    yAxes: [{
      type: 'arrayLinear'
    }]
  }
};
export const horizontalDefaults = {
  scales: {
    xAxes: [{
      type: 'arrayLinear'
    }],
  }
};

export function toFixed(value) {
  const decimals = this._chart.config.options.tooltipDecimals; // inject number of decimals from config
  if (decimals == null || typeof decimals !== 'number' || decimals < 0) {
    return value;
  }
  return Number.parseFloat(value).toFixed(decimals);
}

const array = {
  _elementOptions() {
    return {};
  },
  updateElement(elem, index, reset) {
    const dataset = this.getDataset();
    const custom = elem.custom || {};
    const options = this._elementOptions();

    Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
    const resolve = Chart.helpers.options.resolve;

    const keys = ['outlierRadius', 'itemRadius', 'itemStyle', 'itemBackgroundColor', 'itemBorderColor', 'outlierColor', 'medianColor', 'hitPadding'];
    // Scriptable options
    const context = {
      chart: this.chart,
      dataIndex: index,
      dataset,
      datasetIndex: this.index
    };

    keys.forEach((item) => {
      elem._model[item] = resolve([custom[item], dataset[item], options[item]], context, index);
    });
  },
  _calculateCommonModel(r, data, container, scale) {
    if (container.outliers) {
      r.outliers = container.outliers.map((d) => scale.getPixelForValue(Number(d)));
    }

    if (Array.isArray(data)) {
      r.items = data.map((d) => scale.getPixelForValue(Number(d)));
    }
  }
};

export default array;
