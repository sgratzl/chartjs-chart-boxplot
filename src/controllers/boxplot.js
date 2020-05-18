import { asBoxPlotStats, defaultStatsOptions } from '../data';
import { controllers, helpers, defaults } from 'chart.js';
import { baseDefaults, StatsBase } from './base';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';

export class BoxPlot extends StatsBase {
  _parseStats(value, config) {
    return asBoxPlotStats(value, config);
  }

  _toStringStats(b) {
    return `(min: ${b.min}, 25% quantile: ${b.q1}, median: ${b.median}, 75% quantile: ${b.q3}, max: ${b.max})`;
  }

  _transformStats(target, source, mapper) {
    for (const key of ['min', 'max', 'median', 'q3', 'q1', 'whiskerMin', 'whiskerMax']) {
      target[key] = mapper(source[key]);
    }
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(source[key])) {
        target[key] = source[key].map(mapper);
      }
    }
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
      baseDefaults(boxOptionsKeys),
      {
        datasets: Object.assign(
          {
            animation: {
              numbers: {
                type: 'number',
                properties: defaults.bar.datasets.animation.numbers.properties.concat(
                  ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax'],
                  boxOptionsKeys.filter((c) => !c.endsWith('Color'))
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

export class HorizontalBoxPlot extends BoxPlot {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}

HorizontalBoxPlot.id = 'horizontalBoxplot';
HorizontalBoxPlot.register = () => {
  HorizontalBoxPlot.prototype.dataElementType = BoxAndWiskers.register();
  HorizontalBoxPlot.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
    boxOptionsKeys
  );

  defaults.set(
    HorizontalBoxPlot.id,
    helpers.merge({}, [
      defaults.horizontalBar,
      baseDefaults(boxOptionsKeys),
      {
        datasets: Object.assign(
          {
            animation: {
              numbers: {
                type: 'number',
                properties: defaults.bar.datasets.animation.numbers.properties.concat(
                  ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax'],
                  boxOptionsKeys.filter((c) => !c.endsWith('Color'))
                ),
              },
            },
          },
          defaultStatsOptions
        ),
      },
    ])
  );
  controllers[HorizontalBoxPlot.id] = HorizontalBoxPlot;
  return HorizontalBoxPlot;
};
