'use strict';

import * as Chart from 'chart.js';
import {getRightValue, commonDataLimits, commonScaleOptions} from '../data';

const helpers = Chart.helpers;

const ArrayLogarithmicScaleOptions = helpers.merge({}, [commonScaleOptions, Chart.scaleService.getScaleDefaults('logarithmic')]);


const ArrayLogarithmicScale = Chart.scaleService.getScaleConstructor('logarithmic').extend({
  getRightValue(rawValue) {
    return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue, this.options.ticks));
  },
  _parseValue(rawValue) {
    return Chart.LinearScaleBase.prototype._parseValue.call(this, getRightValue(rawValue, this.options.ticks));
  },
  determineDataLimits() {
    // Add whitespace around bars. Axis shouldn't go exactly from min to max
    const tickOpts = this.options.ticks;
    this.minNotZero = null;
    commonDataLimits.call(this, (boxPlot) => {
      const value = boxPlot[tickOpts.minStats];
      if (value !== 0 && (this.minNotZero === null || value < this.minNotZero)) {
        this.minNotZero = value;
      }
    });

    this.min = helpers.valueOrDefault(tickOpts.min, this.min - this.min * 0.05);
    this.max = helpers.valueOrDefault(tickOpts.max, this.max + this.max * 0.05);

    if (this.min === this.max) {
      if (this.min !== 0 && this.min !== null) {
        this.min = Math.pow(10, Math.floor(helpers.log10(this.min)) - 1);
        this.max = Math.pow(10, Math.floor(helpers.log10(this.max)) + 1);
      } else {
        this.min = 1;
        this.max = 10;
      }
    }
  }
});
Chart.scaleService.registerScaleType('arrayLogarithmic', ArrayLogarithmicScale, ArrayLogarithmicScaleOptions);

export default ArrayLogarithmicScale;
