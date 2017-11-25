'use strict';

const defaults = {
     tooltips: {
        callbacks: {
            label: function (tooltipItem, data) {
                const boxPlotItem = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                return `min: ${boxPlotItem.min}, q1: ${boxPlotItem.q1}, median: ${boxPlotItem.median}, q3: ${boxPlotItem.q3}, max: ${boxPlotItem.max}`;
            }
        }
    }
};

module.exports = function (Chart) {
    const canvasHelpers = Chart.canvasHelpers;
    Chart.defaults.boxplot = Object.assign({}, Chart.defaults.bar, defaults);
    Chart.defaults.horizontalBoxPlot = Object.assign({}, Chart.defaults.horizontalBar, defaults);

    const boxplot = {

        dataElementType: Chart.elements.BoxAndWhiskers,

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
            Object.key(boxplot).forEach((key) => {
                r[key] = scale.getPixelForValue(Number(boxplot[key]));
            });
            return r;
        },

        draw() {
            const ctx = this.chart.chart.ctx;
            const elements = this.getMeta().data;

            canvasHelpers.clipArea(ctx, this.chart.chartArea);

            elements.forEach((elem) => {
                elem.draw();
            });

            canvasHelpers.unclipArea(ctx);
        },

    };
    /**
     * This class is based off controller.bar.js from the upstream Chart.js library
     */
    Chart.controllers.boxplot = Chart.controllers.bar.extend(boxplot);

	Chart.controllers.horizontalBoxPlot = Chart.controllers.horizontalBar.extend(boxplot);
};
