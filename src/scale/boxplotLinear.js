'use strict';

module.exports = function (Chart) {
    const BoxPlotLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({
        getRightValue(rawValue) {
            if (rawValue.median !== undefined) {
                rawValue = rawValue.median;
            }
            return Chart.LinearScaleBase.prototype.getRightValue.call(this, rawValue);
        },
        determineDataLimits() {
            const chart = this.chart;
            const isHorizontal = this.isHorizontal();

            const matchID = (meta) => isHorizontal ? meta.xAxisID === this.id : meta.yAxisID === this.id;

            // First Calculate the range
            this.min = null;
            this.max = null;

            // Regular charts use x, y values
            // For the boxplot chart we have rawValue.min and rawValue.max for each point
            chart.data.datasets.forEach((d, i) => {
                const meta = chart.getDatasetMeta(i);
                if (!chart.isDatasetVisible(i) || !matchID(meta)) {
                    return;
                }
                d.data.forEach((boxPlot, j) => {
                    if (!boxPlot || meta.data[j].hidden) {
                        return;
                    }
                    if (this.min === null) {
                        this.min = boxPlot.min;
                    } else if (boxPlot.min < this.min) {
                        this.min = boxPlot.min;
                    }

                    if (this.max === null) {
                        this.max = boxPlot.max;
                    } else if (boxPlot.max > this.max) {
                        this.max = boxPlot.max;
                    }
                });
            });

            // Add whitespace around bars. Axis shouldn't go exactly from min to max
            this.min = this.min - this.min * 0.05;
            this.max = this.max + this.max * 0.05;

            // Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
            this.handleTickRangeOptions();
        }
    });
    Chart.scaleService.registerScaleType('boxplotLinear', BoxPlotLinearScale, Chart.scaleService.getScaleDefaults('linear'));

};
