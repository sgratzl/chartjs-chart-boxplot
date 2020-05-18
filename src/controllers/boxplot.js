import { asBoxPlotStats, defaultStatsOptions } from '../data';
import { controllers, helpers, defaults } from 'chart.js';
import { baseDefaults, configKeys } from './base';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';

// Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [
//   Chart.defaults.horizontalBar,
//   horizontalDefaults,
//   boxplotDefaults,
// ]);

export class BoxPlot extends controllers.bar {
  getMinMax(scale, canStack) {
    const bak = scale.axis;
    const config = this._config;
    scale.axis = config.minStats;
    const min = super.getMinMax(scale, canStack).min;
    scale.axis = config.maxStats;
    const max = super.getMinMax(scale, canStack).max;
    scale.axis = bak;
    return { min, max };
  }
  parseArrayData(meta, data, start, count) {
    const vScale = meta.vScale;
    const iScale = meta.iScale;
    const labels = iScale.getLabels();
    const r = [];
    for (let i = 0; i < count; i++) {
      const index = i + start;
      const parsed = {};
      parsed[iScale.axis] = iScale.parse(labels[index], index);
      const stats = asBoxPlotStats(data[index], this._config);
      if (stats) {
        Object.assign(parsed, stats);
        parsed[vScale.axis] = stats.median;
      }
      r.push(parsed);
    }
    return r;
  }

  parseObjectData(meta, data, start, count) {
    return this.parseArrayData(meta, data, start, count);
  }

  getLabelAndValue(index) {
    const r = super.getLabelAndValue(index);
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    if (!vScale || !parsed) {
      return r;
    }
    r.value = {
      raw: parsed,
      hoveredOutlierIndex: -1,
      toString() {
        if (this.hoveredOutlierIndex >= 0) {
          return `(outlier: ${this.outliers[this.hoveredOutlierIndex]})`;
        }
        // custom to string function for the 'value'
        return `(min: ${this.min}, 25% quantile: ${this.q1}, median: ${this.median}, 75% quantile: ${this.q3}, max: ${this.max})`;
      },
    };
    this._transformBoxplot(r.value, parsed, (v) => vScale.getLabelForValue(v));
    return r;
  }

  _transformBoxplot(target, source, mapper) {
    for (const key of ['min', 'max', 'median', 'q3', 'q1', 'whiskerMin', 'whiskerMax']) {
      target[key] = mapper(source[key]);
    }
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(source[key])) {
        target[key] = source[key].map(mapper);
      }
    }
  }

  updateElement(rectangle, index, properties, mode) {
    const reset = mode === 'reset';
    const scale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    const base = scale.getBasePixel();
    this._transformBoxplot(properties, parsed, (v) => (reset ? base : scale.getPixelForValue(v)));
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
      baseDefaults(),
      {
        datasets: Object.assign(
          {
            minStats: 'min',
            maxStats: 'max',
            animation: {
              numbers: {
                type: 'number',
                properties: defaults.bar.datasets.animation.numbers.properties.concat(
                  ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax'],
                  configKeys.filter((c) => !c.endsWith('Color'))
                ),
              },
            },
          },
          defaultStatsOptions
        ),
      },
    ])
  );
  controllers[BoxPlot.id] = BoxPlot;
  return BoxPlot;
};
// export const HorizontalBoxPlot = (Chart.controllers.horizontalBoxplot = Chart.controllers.horizontalBar.extend(
//   boxplot
// ));
