import { asBoxPlotStats } from '../data';
import { Chart, patchControllerConfig, registerController, defaults, BarController, merge } from '../chart';
import { baseDefaults, StatsBase } from './base';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';

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
BoxPlotController.defaults = /*#__PURE__*/ merge({}, [
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
]);

BoxPlotController.register = () => {
  BoxPlotController.prototype.dataElementType = BoxAndWiskers.register();
  BoxPlotController.prototype.dataElementOptions = BarController.prototype.dataElementOptions.concat(boxOptionsKeys);

  return registerController(BoxPlotController);
};

export class BoxPlotChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, BoxPlotController));
  }
}
BoxPlotChart.id = BoxPlotController.id;
