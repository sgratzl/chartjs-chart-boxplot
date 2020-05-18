import { asBoxPlotStats } from '../data';
import { Chart, controllers, helpers, defaults } from '../chart';
import { baseDefaults, StatsBase } from './base';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';
import { patchControllerConfig } from './utils';

export class BoxPlotController extends StatsBase {
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

BoxPlotController.id = 'boxplot';
BoxPlotController.register = () => {
  BoxPlotController.prototype.dataElementType = BoxAndWiskers.register();
  BoxPlotController.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(boxOptionsKeys);

  defaults.set(
    BoxPlotController.id,
    helpers.merge({}, [
      defaults.bar,
      baseDefaults(boxOptionsKeys),
      {
        datasets: {
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
      },
    ])
  );
  controllers[BoxPlotController.id] = BoxPlotController;
  return BoxPlotController;
};

export class BoxPlotChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, BoxPlotController));
  }
}
BoxPlotChart.id = BoxPlotController.id;

export class HorizontalBoxPlotController extends BoxPlotController {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}

HorizontalBoxPlotController.id = 'horizontalBoxplot';
HorizontalBoxPlotController.register = () => {
  HorizontalBoxPlotController.prototype.dataElementType = BoxAndWiskers.register();
  HorizontalBoxPlotController.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
    boxOptionsKeys
  );

  defaults.set(
    HorizontalBoxPlotController.id,
    helpers.merge({}, [
      defaults.horizontalBar,
      baseDefaults(boxOptionsKeys),
      {
        datasets: {
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
      },
    ])
  );
  controllers[HorizontalBoxPlotController.id] = HorizontalBoxPlotController;
  return HorizontalBoxPlotController;
};

export class HorizontalBoxPlotChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, HorizontalBoxPlotController));
  }
}
HorizontalBoxPlotChart.id = HorizontalBoxPlotController.id;
