'use strict';

const defaults = {
    label: '',

    hover: {
        mode: 'label'
    },

    scales: {
        xAxes: [{
            type: 'time',
            distribution: 'series',
            categoryPercentage: 0.8,
            barPercentage: 0.9,
            time: {
                format: 'll'
            },
            ticks: {
                source: 'data'
            }
        }],
        yAxes: [{
            type: 'financialLinear'
        }]
    },

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
    const helpers = Chart.helpers;
    Chart.defaults.boxplot = defaults;

    /**
     * This class is based off controller.bar.js from the upstream Chart.js library
     */
    Chart.controllers.boxplot = Chart.controllers.bar.extend({

        dataElementType: Chart.elements.BoxAndWhiskers,

        updateElement(candle, index, reset) {
            const me = this;
            const chart = me.chart;
            const meta = me.getMeta();
            const dataset = me.getDataset();
            const custom = candle.custom || {};

            candle._xScale = me.getScaleForId(meta.xAxisID);
            candle._yScale = me.getScaleForId(meta.yAxisID);
            candle._datasetIndex = me.index;
            candle._index = index;

            candle._model = {
                datasetLabel: dataset.label || '',
                //label: '', // to get label value please use dataset.data[index].label

                // Appearance
                upCandleColor: dataset.upCandleColor,
                downCandleColor: dataset.downCandleColor,
                outlineCandleColor: dataset.outlineCandleColor,
                outlineCandleWidth: dataset.outlineCandleWidth,
            };

            me.updateElementGeometry(candle, index, reset);

            candle.pivot();
        },

        /**
         * @private
         */
        updateElementGeometry(rectangle, index, reset) {
            const me = this;
            const model = rectangle._model;
            const vscale = me.getValueScale();
            const base = vscale.getBasePixel();
            const horizontal = vscale.isHorizontal();
            const ruler = me._ruler || me.getRuler();
            const vpixels = me.calculateBarValuePixels(me.index, index);
            const ipixels = me.calculateBarIndexPixels(me.index, index, ruler);

            model.horizontal = horizontal;
            model.base = reset ? base : vpixels.base;
            model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
            model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
            model.height = horizontal ? ipixels.size : undefined;
            model.width = horizontal ? undefined : ipixels.size;
            model.candle = me.calculateCandleValuesPixels(me.index, index);
        },

        /**
         * @private
         */
        calculateCandleValuesPixels(datasetIndex, index) {
            const me = this;
            const chart = me.chart;
            const scale = me.getValueScale();
            const datasets = chart.data.datasets;

            return {
                o: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].o)),
                h: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].h)),
                l: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].l)),
                c: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].c))
            };
        },

        draw() {
            const ctx = this.chart.chart.ctx;
            const elements = this.getMeta().data;
            const dataset = this.getDataset();
            const ilen = elements.length;
            const i = 0;
            let d;

            Chart.canvasHelpers.clipArea(ctx, this.chart.chartArea);

            for (; i < ilen; ++i) {
                d = dataset.data[i].o;
                if (d !== null && d !== undefined && !isNaN(d)) {
                    elements[i].draw();
                }
            }

            Chart.canvasHelpers.unclipArea(ctx);
        },

    });
};
