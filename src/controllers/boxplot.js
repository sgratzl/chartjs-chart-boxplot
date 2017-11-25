'use strict';

const defaults = {
    tooltips: {
        callbacks: {
            label: function (item, data) {
                const datasetLabel = data.datasets[item.datasetIndex].label || '';
                const boxPlotItem = data.datasets[item.datasetIndex].data[item.index];
                return `${datasetLabel} ${typeof item.xLabel === 'string' ? item.xLabel : item.yLabel} (min: ${boxPlotItem.min}, q1: ${boxPlotItem.q1}, median: ${boxPlotItem.median}, q3: ${boxPlotItem.q3}, max: ${boxPlotItem.max})`;
            }
        }
    }
};

module.exports = function (Chart) {
    const canvasHelpers = Chart.canvasHelpers;
    Chart.defaults.boxplot = Chart.helpers.merge({}, [Chart.defaults.bar, defaults, {
        scales: {
            yAxes: [{
                type: 'boxplotLinear'
            }]
        }
    }]);
    Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, defaults, {
        scales: {
            xAxes: [{
                type: 'boxplotLinear'
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
            const boxplot = this.chart.data.datasets[datasetIndex].data[index];

            const r = {};
            ['min', 'q1', 'median', 'q3', 'max'].forEach((key) => {
                r[key] = scale.getPixelForValue(Number(boxplot[key]));
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
