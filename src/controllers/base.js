import { interpolateNumberArray } from '../animation';
import { outlierPositioner, patchInHoveredOutlier } from '../tooltip';
import { controllers } from 'chart.js';

export const configKeys = [
  'outlierRadius',
  'itemRadius',
  'itemStyle',
  'itemBackgroundColor',
  'itemBorderColor',
  'outlierColor',
  'medianColor',
  'hitPadding',
  'outlierHitRadius',
  'lowerColor',
];
export const colorStyleKeys = ['borderColor', 'backgroundColor'].concat(configKeys.filter((c) => c.endsWith('Color')));

export function baseDefaults() {
  return {
    datasets: {
      animation: {
        numberArray: {
          fn: interpolateNumberArray,
          properties: ['outliers', 'items'],
        },
        colors: {
          type: 'color',
          properties: colorStyleKeys,
        },
        show: {
          colors: {
            type: 'color',
            properties: colorStyleKeys,
            from: 'transparent',
          },
        },
        hide: {
          colors: {
            type: 'color',
            properties: colorStyleKeys,
            to: 'transparent',
          },
        },
      },
      minStats: 'min',
      maxStats: 'max',
    },
    tooltips: {
      position: outlierPositioner.register().id,
      callbacks: {
        beforeLabel: patchInHoveredOutlier,
      },
    },
  };
}

export class StatsBase extends controllers.bar {
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
      const stats = this._parseStats(data[index], this._config);
      if (stats) {
        Object.assign(parsed, stats);
        parsed[vScale.axis] = stats.median;
      }
      r.push(parsed);
    }
    return r;
  }

  _parseStats(_value, _config) {
    // abstract
    return {};
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
    };
    this._transformStats(r.value, parsed, (v) => vScale.getLabelForValue(v));
    const s = this._toStringStats(r.value);
    r.value.toString = function () {
      // custom to string function for the 'value'
      if (this.hoveredOutlierIndex >= 0) {
        return `(outlier: ${this.outliers[this.hoveredOutlierIndex]})`;
      }
      return s;
    };
    return r;
  }

  _toStringStats(_b) {
    // abstract
    return '';
  }

  _transformStats(_target, _source, _mapper) {
    // abstract
  }

  updateElement(rectangle, index, properties, mode) {
    const reset = mode === 'reset';
    const scale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
    const base = scale.getBasePixel();
    properties._datasetIndex = this.index;
    this._transformStats(properties, parsed, (v) => (reset ? base : scale.getPixelForValue(v)));
    super.updateElement(rectangle, index, properties, mode);
  }
}
