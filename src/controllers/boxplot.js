'use strict';

import {asBoxPlotStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults, horizontalDefaults, toFixed} from './base';

const defaults = {
  tooltips: {
    callbacks: {
      label(item, data) {
        const datasetLabel = data.datasets[item.datasetIndex].label || '';
        const value = data.datasets[item.datasetIndex].data[item.index];
        const b = asBoxPlotStats(value);
        let label = `${datasetLabel} ${typeof item.xLabel === 'string' ? item.xLabel : item.yLabel}`;
        if (!b) {
          return `${label} (NaN)`;
        }
        return `${label} (min: ${toFixed.call(this, b.min)}, q1: ${toFixed.call(this, b.q1)}, median: ${toFixed.call(this, b.median)}, q3: ${toFixed.call(this, b.q3)}, max: ${toFixed.call(this, b.max)})`;
      }
    }
  }
};

Chart.defaults.boxplot = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);
Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults]);

const boxplot = {
  ...base,
  dataElementType: Chart.elements.BoxAndWhiskers,

  _elementOptions() {
    return this.chart.options.elements.boxandwhiskers;
  },
  /**
   * @private
   */
  _updateElementGeometry(elem, index, reset) {
    Chart.controllers.bar.prototype._updateElementGeometry.call(this, elem, index, reset);
    elem._model.boxplot = this._calculateBoxPlotValuesPixels(this.index, index);
  },

  /**
   * @private
   */

  _calculateBoxPlotValuesPixels(datasetIndex, index) {
    const scale = this._getValueScale();
    const data = this.chart.data.datasets[datasetIndex].data[index];
    if (!data) {
      return null;
    }
    const v = asBoxPlotStats(data);

    const r = {};
    Object.keys(v).forEach((key) => {
      if (key !== 'outliers' && key !== 'items') {
        r[key] = scale.getPixelForValue(Number(v[key]));
      }
    });
    this._calculateCommonModel(r, data, v, scale);
    return r;
  }
};
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const BoxPlot = Chart.controllers.boxplot = Chart.controllers.bar.extend(boxplot);
export const HorizontalBoxPlot = Chart.controllers.horizontalBoxplot = Chart.controllers.horizontalBar.extend(boxplot);
