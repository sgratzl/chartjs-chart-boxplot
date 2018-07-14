'use strict';

import {asViolinStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults, horizontalDefaults} from './base';
import {range as d3range, max as d3max} from 'd3-array';

const defaults = {};

Chart.defaults.violin = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);
Chart.defaults.horizontalViolin = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults]);

const controller = Object.assign({}, base, {

  dataElementType: Chart.elements.Violin,

  _elementOptions() {
    return this.chart.options.elements.violin;
  },
  /**
   * @private
   */
  updateElementGeometry(elem, index, reset) {
    Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
    const custom = elem.custom || {};
    const options = this._elementOptions();
    elem._model.violin = this._calculateViolinValuesPixels(this.index, index, custom.points !== undefined ? custom.points : options.points);
  },

  /**
   * @private
   */

  _calculateViolinValuesPixels(datasetIndex, index, points) {
    const scale = this.getValueScale();
    const data = this.chart.data.datasets[datasetIndex].data[index];
    const violin = asViolinStats(data);

    const range = violin.max - violin.min;
    const samples = d3range(violin.min, violin.max, range / points);
    if (samples[samples.length - 1] !== violin.max) {
      samples.push(violin.max);
    }
    const coords = violin.coords || violin.kde(samples).map((v) => ({v: v[0], estimate: v[1]}));
    const r = {
      min: scale.getPixelForValue(violin.min),
      max: scale.getPixelForValue(violin.max),
      median: scale.getPixelForValue(violin.median),
      coords: coords.map(({v, estimate}) => ({v: scale.getPixelForValue(v), estimate})),
      maxEstimate: d3max(coords, (d) => d.estimate)
    };
    this._calculateCommonModel(r, data, violin, scale);
    return r;
  }
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const Violin = Chart.controllers.violin = Chart.controllers.bar.extend(controller);
export const HorizontalViolin = Chart.controllers.horizontalViolin = Chart.controllers.horizontalBar.extend(controller);
