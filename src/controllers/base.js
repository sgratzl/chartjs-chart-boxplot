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

const configKeys = ['outlierRadius', 'itemRadius', 'itemStyle', 'itemBackgroundColor', 'itemBorderColor', 'outlierColor', 'medianColor', 'hitPadding', 'outlierHitRadius'];
const configKeyIsColor = [false, false, false, true, true, true, true, false, false];

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

    // Scriptable options
    const context = {
      chart: this.chart,
      dataIndex: index,
      dataset,
      datasetIndex: this.index
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
  setHoverStyle(element) {
    Chart.controllers.bar.prototype.setHoverStyle.call(this, element);

    const dataset = this.chart.data.datasets[element._datasetIndex];
    const index = element._index;
    const custom = element.custom || {};
    const model = element._model;
    const getHoverColor = Chart.helpers.getHoverColor;
    const resolve = Chart.helpers.options.resolve;


    configKeys.forEach((item, i) => {
      element.$previousStyle[item] = model[item];
      const hoverKey = `hover${item.charAt(0).toUpperCase()}${item.slice(1)}`;
      const modelValue = configKeyIsColor[i] && model[item] != null ? getHoverColor(model[item]) : model[item];
      element._model[item] = resolve([custom[hoverKey], dataset[hoverKey], modelValue], undefined, index);
    });
  }
};

export default array;
