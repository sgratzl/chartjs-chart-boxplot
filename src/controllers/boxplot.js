import { asBoxPlotStats } from '../data';
import { controllers, helpers, defaults } from 'chart.js';
import { baseDefaults, toFixed } from './base';
import { boxplotPositioner } from '../tooltip';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';

function boxplotTooltip(item, data, ...args) {
  const value = data.datasets[item.datasetIndex].data[item.index];
  const options = this._chart.getDatasetMeta(item.datasetIndex).controller._getValueScale().options.ticks;
  const b = asBoxPlotStats(value, options);

  const hoveredOutlierIndex = this._tooltipOutlier == null ? -1 : this._tooltipOutlier;

  const label = this._options.callbacks.boxplotLabel;
  return label.apply(this, [item, data, b, hoveredOutlierIndex].concat(args));
}

// Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [
//   Chart.defaults.horizontalBar,
//   horizontalDefaults,
//   boxplotDefaults,
// ]);

export class BoxPlot extends controllers.bar {
  getMinMax(scale, canStack) {
    const r = super.getMinMax(scale, canStack);
    // TODO adapt scale.axis to the target stats
    return r;
  }

  parseObjectData(meta, data, start, count) {
    const r = super.parseObjectData(meta, data, start, count);
    const vScale = meta.vScale;
    const iScale = meta.iScale;
    const labels = iScale.getLabels();
    for (let i = 0; i < count; i++) {
      const index = i + start;
      const parsed = r[i];
      parsed[iScale.axis] = iScale.parse(labels[index], index);
      const stats = asBoxPlotStats(data[index]); // TODO options
      if (stats) {
        Object.assign(parsed, stats);
        parsed[vScale.axis] = stats.median;
      }
    }
    return r;
  }

  getLabelAndValue(index) {
    const r = super.getLabelAndValue(index);
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    if (!vScale || !parsed) {
      return r;
    }
    const v = (v) => vScale.getLabelForValue(v);
    r.value = Object.assign(
      {
        toString() {
          // custom to string function for the 'value'
          return `(min: ${v(this.min)}, 25% quantile: ${v(this.q1)}, median: ${v(this.median)}, 75% quantile: ${v(
            this.q3
          )}, max: ${v(this.max)})`;
        },
      },
      parsed
    );
    return r;
  }

  updateElement(rectangle, index, properties, mode) {
    const reset = mode === 'reset';
    const scale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    const base = scale.getBasePixel();
    for (const key of ['median', 'q3', 'q1', 'whiskerMin', 'whiskerMax']) {
      properties[key] = reset ? base : scale.getPixelForValue(parsed[key]);
    }
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(parsed[key])) {
        properties[key] = parsed[key].map((v) => (reset ? base : scale.getPixelForValue(v)));
      }
    }
    super.updateElement(rectangle, index, properties, mode);
  }
}

BoxPlot.id = 'boxplot';
BoxPlot.register = () => {
  BoxPlot.prototype.dataElementType = BoxAndWiskers.register();
  BoxPlot.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(boxOptionsKeys);

  defaults.set(
    BoxPlot.id,
    helpers.merge({}, [
      defaults.bar,
      baseDefaults,
      {
        datasets: {
          animation: {
            numbers: {
              type: 'number',
              properties: defaults.bar.datasets.animation.numbers.properties.concat([
                'q1',
                'q3',
                'min',
                'max',
                'median',
                'whiskerMin',
                'whiskerMax',
              ]),
            },
          },
        },
        tooltips: {
          // position: boxplotPositioner.register().id,
          // callbacks: {
          //   label: boxplotTooltip,
          //   boxplotLabel(item, data, b, hoveredOutlierIndex) {
          //     const datasetLabel = data.datasets[item.datasetIndex].label || '';
          //     let label = `${datasetLabel} ${typeof item.xLabel === 'string' ? item.xLabel : item.yLabel}`;
          //     if (!b) {
          //       return `${label} (NaN)`;
          //     }
          //     if (hoveredOutlierIndex >= 0) {
          //       const outlier = b.outliers[hoveredOutlierIndex];
          //       return `${label} (outlier: ${toFixed.call(this, outlier)})`;
          //     }
          //     return `${label} (min: ${toFixed.call(this, b.min)}, q1: ${toFixed.call(
          //       this,
          //       b.q1
          //     )}, median: ${toFixed.call(this, b.median)}, q3: ${toFixed.call(this, b.q3)}, max: ${toFixed.call(
          //       this,
          //       b.max
          //     )})`;
          //   },
          // },
        },
      },
    ])
  );
  controllers[BoxPlot.id] = BoxPlot;
  return BoxPlot;
};
// export const HorizontalBoxPlot = (Chart.controllers.horizontalBoxplot = Chart.controllers.horizontalBar.extend(
//   boxplot
// ));
