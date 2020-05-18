import { asViolinStats } from '../data';
import { controllers, defaults, helpers } from 'chart.js';
import { StatsBase, baseDefaults } from './base';
import { baseOptionKeys } from '../elements/base';
import { ViolinElement } from '../elements';
import { interpolateKdeCoords } from '../animation';

export class Violin extends StatsBase {
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

Violin.id = 'violin';
Violin.register = () => {
  Violin.prototype.dataElementType = ViolinElement.register();
  Violin.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(baseOptionKeys);

  defaults.set(
    Violin.id,
    helpers.merge({}, [
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
    ])
  );
  controllers[Violin.id] = Violin;
  return Violin;
};

export class HorizontalViolin extends Violin {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}

HorizontalViolin.id = 'horizontalViolin';
HorizontalViolin.register = () => {
  HorizontalViolin.prototype.dataElementType = ViolinElement.register();
  HorizontalViolin.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
    baseOptionKeys
  );

  defaults.set(
    HorizontalViolin.id,
    helpers.merge({}, [
      defaults.horizontalBar,
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
    ])
  );
  controllers[HorizontalViolin.id] = HorizontalViolin;
  return HorizontalViolin;
};
