'use strict';

module.exports = function (Chart) {
	const helpers = Chart.helpers;

    const BoxPlotLogarithmicScale = Chart.scaleService.getScaleConstructor('logarithmic').extend({
        determineDataLimits: function() {
            const chart = this.chart;
			const isHorizontal = this.isHorizontal();

            const matchID = (meta) => isHorizontal ? meta.xAxisID === this.id : meta.yAxisID === this.id;

            // First Calculate the range
            this.min = null;
            this.max = null;
            this.minNotZero = null;

			// Regular charts use x, y values
            // For the boxplot chart we have rawValue.min and rawValue.max for each point
            chart.data.datasets.forEach((d, i) => {
                const meta = chart.getDatasetMeta(i);
                if (!chart.isDatasetVisible(i) || !matchID(meta)) {
                    return;
                }
                d.data.forEach((boxPlot) => {
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

                    if (boxPlot.min !== 0 && (this.minNotZero === null || boxPlot.min < this.minNotZero)) {
                        this.minNotZero = boxPlot.min;
                    }
                });
            });

            // Add whitespace around bars. Axis shouldn't go exactly from min to max
            const tickOpts = this.options.ticks;
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
    Chart.scaleService.registerScaleType('boxplotLogarithmic', BoxPlotLogarithmicScale, Chart.scaleService.getScaleDefaults('logarithmic'));

};
