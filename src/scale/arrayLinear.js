'use strict';

import * as Chart from 'chart.js';
import {getRightValue, commonDataLimits, commonScaleOptions} from '../data';

const helpers = Chart.helpers;

const ArrayLinearScaleOptions = helpers.merge({}, [commonScaleOptions, Chart.scaleService.getScaleDefaults('linear')]);

const ArrayLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({
  getRightValue(rawValue) {
    return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue, this.options.ticks));
  },
  _parseValue(rawValue) {
    return Chart.LinearScaleBase.prototype._parseValue.call(this, getRightValue(rawValue, this.options.ticks));
  },
  determineDataLimits() {
    commonDataLimits.call(this);
    // Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
    this.handleTickRangeOptions();
  }
});
Chart.scaleService.registerScaleType('arrayLinear', ArrayLinearScale, ArrayLinearScaleOptions);

export default ArrayLinearScale;
