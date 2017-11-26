'use strict';

const {asBoxPlotStats} = require('../data.js');

const defaults = {
    tooltips: {
        callbacks: {
            label: function (item, data) {
                const datasetLabel = data.datasets[item.datasetIndex].label || '';
                const value = data.datasets[item.datasetIndex].data[item.index];
                const b = asBoxPlotStats(value);
                let label = `${datasetLabel} ${typeof item.xLabel === 'string' ? item.xLabel : item.yLabel}`;
                if (!b) {
                	return label + 'NaN';
				}
                return `${label} (min: ${b.min}, q1: ${b.q1}, median: ${b.median}, q3: ${b.q3}, max: ${b.max})`;
            }
        }
    }
};

module.exports = function (Chart) {
    const canvasHelpers = Chart.canvasHelpers;
    Chart.defaults.boxplot = Chart.helpers.merge({}, [Chart.defaults.bar, defaults, {
        scales: {
            yAxes: [{
                type: 'arrayLinear'
            }]
        }
    }]);
    Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, defaults, {
        scales: {
            xAxes: [{
                type: 'arrayLinear'
            }]
        }
    }]);

    const boxplot = {

        dataElementType: Chart.elements.BoxAndWhiskers,

        updateElement: function(elem, index, reset) {
            const dataset = this.getDataset();
			const custom = elem.custom || {};
			const boxplotOptions = this.chart.options.elements.boxandwhiskers;

            Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
            elem._model.outlierRadius = custom.outlierRadius ? custom.outlierRadius : Chart.helpers.valueAtIndexOrDefault(dataset.outlierRadius, index, boxplotOptions.outlierRadius);
        },
        /**
         * @private
         */
        updateElementGeometry(elem, index, reset) {
            Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
            elem._model.boxplot = this._calculateBoxPlotValuesPixels(this.index, index);
        },

        /**
         * @private
         */

        _calculateBoxPlotValuesPixels(datasetIndex, index) {
            const scale = this.getValueScale();
            const boxplot = asBoxPlotStats(this.chart.data.datasets[datasetIndex].data[index]);

            const r = {};
            Object.keys(boxplot).forEach((key) => {
            	if (key !== 'outliers') {
					r[key] = scale.getPixelForValue(Number(boxplot[key]));
				}
            });
            if (boxplot.outliers) {
                r.outliers = boxplot.outliers.map((d) =>  scale.getPixelForValue(Number(d)));
            }
            return r;
        }
    };
    /**
     * This class is based off controller.bar.js from the upstream Chart.js library
     */
    Chart.controllers.boxplot = Chart.controllers.bar.extend(boxplot);

    Chart.controllers.horizontalBoxplot = Chart.controllers.horizontalBar.extend(boxplot);
};
