import { asViolinStats } from '../data';
import { Chart, merge, BarController } from '@sgratzl/chartjs-esm-facade';
import { StatsBase, baseDefaults } from './base';
import { baseOptionKeys } from '../elements/base';
import { Violin } from '../elements';
import { interpolateKdeCoords } from '../animation';
import patchController from './patchController';

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
  BarController.defaults,
  baseDefaults(baseOptionKeys),
  {
    datasets: {
      points: 100,
      animation: {
        numbers: {
          type: 'number',
          properties: BarController.defaults.datasets.animation.numbers.properties.concat(
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
    dataElementType: Violin.id,
    dataElementOptions: BarController.defaults.dataElementOptions.concat(baseOptionKeys),
  },
]);

export class ViolinChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, ViolinController, Violin));
  }
}
ViolinChart.id = ViolinController.id;
