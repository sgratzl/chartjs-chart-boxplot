'use strict';

const defaults = {
    tooltips: {
        callbacks: {
            label: function (item, data) {
                const datasetLabel = data.datasets[item.datasetIndex].label || '';
                const boxPlotItem = data.datasets[item.datasetIndex].data[item.index];
                return `${datasetLabel} (min: ${boxPlotItem.min}, q1: ${boxPlotItem.q1}, median: ${boxPlotItem.median}, q3: ${boxPlotItem.q3}, max: ${boxPlotItem.max})`;
            }
        }
    }
};

module.exports = function (Chart) {
    const canvasHelpers = Chart.canvasHelpers;
    Chart.defaults.boxplot =  Chart.helpers.merge({}, [Chart.defaults.bar, defaults, {
        scales: {
            yAxes: [{
                type: 'boxplotLinear'
            }]
        }
    }]);
    Chart.defaults.horizontalBoxPlot = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, defaults, {
        scales: {
            xAxes: [{
                type: 'boxplotLinear'
            }]
        }
    }]);

    const boxplot = {

        dataElementType: Chart.elements.BoxAndWhiskers,

        /**
         * @private
         */
        updateElementGeometry(elem, index, reset) {
            Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
            const boxplot = this._calculateBoxPlotValuesPixels(this.index, index);

            const vscale = this.getValueScale();
			const base = vscale.getBasePixel();
            const horizontal = vscale.isHorizontal();

            // fix x, y position to consider box plot data structure
            elem._model.x = horizontal && !reset ? boxplot.median : elem._model.x;
            elem._model.y = !horizontal && !reset ? boxplot.median : elem._model.x;
            elem._model.boxplot = boxplot; 
        },

        /**
         * @private
         */

        _calculateBoxPlotValuesPixels(datasetIndex, index) {
            const scale = this.getValueScale();
            const boxplot = this.chart.data.datasets[datasetIndex].data[index];

            const r = {};
            Object.keys(boxplot).forEach((key) => {
                r[key] = scale.getPixelForValue(Number(boxplot[key]));
            });
            return r;
        },

        draw() {
            const ctx = this.chart.chart.ctx;
            const elements = this.getMeta().data;
            const data = this.getDataset().data;
            canvasHelpers.clipArea(ctx, this.chart.chartArea);

            elements.forEach((elem, i) => {
                if (data[i]) {
                    elem.draw();
                }
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
