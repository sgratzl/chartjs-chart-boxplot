import { asViolinStats } from '../data';
import { Chart, defaults, merge, BarController, registerController, patchControllerConfig } from '../chart';
import { StatsBase, baseDefaults } from './base';
import { baseOptionKeys } from '../elements/base';
import { ViolinElement } from '../elements';
import { interpolateKdeCoords } from '../animation';

export class ViolinController extends StatsBase {
  _parseStats(value, config) {
    return asViolinStats(value, config);
  }

  _toStringStats(v) {
    return `(min: ${v.min}, 25% quantile: ${v.q1}, median: ${v.median}, 75% quantile: ${v.q3}, max: ${v.max})`;
  }

  _transformStats(target, source, mapper) {
    for (const key of ['min', 'max', 'median', 'q3', 'q1']) {
      target[key] = mapper(source[key]);
    }
    target.maxEstimate = source.maxEstimate;
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(source[key])) {
        target[key] = source[key].map(mapper);
      }
    }
    if (Array.isArray(source.coords)) {
      target.coords = source.coords.map((coord) => Object.assign({}, coord, { v: mapper(coord.v) }));
    }
  }
}

ViolinController.id = 'violin';
ViolinController.defaults = /*#__PURE__*/ merge({}, [
  defaults.bar,
  baseDefaults(baseOptionKeys),
  {
    datasets: {
      points: 100,
      animation: {
        numbers: {
          type: 'number',
          properties: defaults.bar.datasets.animation.numbers.properties.concat(
            ['q1', 'q3', 'min', 'max', 'median', 'maxEstimate'],
            baseOptionKeys.filter((c) => !c.endsWith('Color'))
          ),
        },
        kdeCoords: {
          fn: interpolateKdeCoords,
          properties: ['coords'],
        },
      },
    },
  },
]);
ViolinController.register = () => {
  ViolinController.prototype.dataElementType = ViolinElement.register();
  ViolinController.prototype.dataElementOptions = BarController.prototype.dataElementOptions.concat(baseOptionKeys);
  return registerController(ViolinController);
};

export class ViolinChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, ViolinController));
  }
}
ViolinChart.id = ViolinController.id;

export class HorizontalViolinController extends ViolinController {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}
