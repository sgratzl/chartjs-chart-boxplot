'use strict';

import * as Chart from 'chart.js';
import {getRightValue, commonDataLimits} from '../data';

const ArrayLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({
	getRightValue(rawValue) {
		return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue));
	},
	determineDataLimits() {
		commonDataLimits.call(this);
		// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
		this.handleTickRangeOptions();
	}
});
Chart.scaleService.registerScaleType('arrayLinear', ArrayLinearScale, Chart.scaleService.getScaleDefaults('linear'));

export default ArrayLinearScale;
