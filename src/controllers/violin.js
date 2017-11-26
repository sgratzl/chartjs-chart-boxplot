'use strict';

import {asViolinStats} from '../data';
import * as Chart from 'chart.js';
import base, {verticalDefaults, horizontalDefaults} from './base';

const defaults = {};

Chart.defaults.violin = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults]);
Chart.defaults.horizontalViolin = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults]);

const violin = Object.assign({}, base, {

	dataElementType: Chart.elements.Violin,

	_elementOptions() {
		return this.chart.options.elements.violin;
	},
	/**
	 * @private
	 */
	updateElementGeometry(elem, index, reset) {
		Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
		elem._model.violin = this._calculateViolinValuesPixels(this.index, index);
	},

	/**
	 * @private
	 */

	_calculateViolinValuesPixels(datasetIndex, index) {
		const scale = this.getValueScale();
		const data = this.chart.data.datasets[datasetIndex].data[index];
		const violin = asViolinStats(data);

		const r = {};
		Object.keys(violin).forEach((key) => {
			if (key !== 'outliers') {
				r[key] = scale.getPixelForValue(Number(violin[key]));
			}
		});
		this._calculateCommonModel(r, data, violin, scale);
		return r;
	}
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export const Violin = Chart.controllers.violin = Chart.controllers.bar.extend(violin);
export const HorizontalViolin = Chart.controllers.horizontalViolin = Chart.controllers.horizontalBar.extend(violin);
