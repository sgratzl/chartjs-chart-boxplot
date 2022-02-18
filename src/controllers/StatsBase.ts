import { BarController, Element, ChartMeta, LinearScale, Scale, UpdateMode } from 'chart.js';
import { formatNumber } from 'chart.js/helpers';
import { interpolateNumberArray } from '../animation';
import { outlierPositioner, patchInHoveredOutlier } from '../tooltip';
import { defaultStatsOptions, IBaseOptions, IBaseStats } from '../data';

export /* #__PURE__ */ function baseDefaults(keys: string[]): Record<string, unknown> {
  const colorKeys = ['borderColor', 'backgroundColor'].concat(keys.filter((c) => c.endsWith('Color')));
  return {
    animations: {
      numberArray: {
        fn: interpolateNumberArray,
        properties: ['outliers', 'items'],
      },
      colors: {
        type: 'color',
        properties: colorKeys,
      },
    },
    transitions: {
      show: {
        animations: {
          colors: {
            type: 'color',
            properties: colorKeys,
            from: 'transparent',
          },
        },
      },
      hide: {
        animations: {
          colors: {
            type: 'color',
            properties: colorKeys,
            to: 'transparent',
          },
        },
      },
    },
    minStats: 'min',
    maxStats: 'max',
    ...defaultStatsOptions,
  };
}

export function defaultOverrides(): Record<string, unknown> {
  return {
    plugins: {
      tooltip: {
        position: outlierPositioner.register().id,
        callbacks: {
          beforeLabel: patchInHoveredOutlier,
        },
      },
    },
  };
}

export abstract class StatsBase<S extends IBaseStats, C extends Required<IBaseOptions>> extends BarController {
  declare options: C;

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/explicit-module-boundary-types
  protected _transformStats<T>(target: any, source: S, mapper: (v: number) => T): void {
    for (const key of ['min', 'max', 'median', 'q3', 'q1', 'mean']) {
      const v = source[key as keyof IBaseStats];
      if (typeof v === 'number') {
        // eslint-disable-next-line no-param-reassign
        target[key] = mapper(v);
      }
    }
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(source[key as keyof IBaseStats])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = source[key as 'outliers' | 'items'].map(mapper);
      }
    }
  }

  getMinMax(scale: Scale, canStack?: boolean | undefined): { min: number; max: number } {
    const bak = scale.axis;
    const config = this.options;
    // eslint-disable-next-line no-param-reassign
    scale.axis = config.minStats;
    const { min } = super.getMinMax(scale, canStack);
    // eslint-disable-next-line no-param-reassign
    scale.axis = config.maxStats;
    const { max } = super.getMinMax(scale, canStack);
    // eslint-disable-next-line no-param-reassign
    scale.axis = bak;
    return { min, max };
  }

  parsePrimitiveData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vScale = meta.vScale!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iScale = meta.iScale!;
    const labels = iScale.getLabels();
    const r = [];
    for (let i = 0; i < count; i += 1) {
      const index = i + start;
      const parsed: any = {};
      parsed[iScale.axis] = iScale.parse(labels[index], index);
      const stats = this._parseStats(data == null ? null : data[index], this.options);
      if (stats) {
        Object.assign(parsed, stats);
        parsed[vScale.axis] = stats.median;
      }
      r.push(parsed);
    }
    return r;
  }

  parseArrayData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    return this.parsePrimitiveData(meta, data, start, count);
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    return this.parsePrimitiveData(meta, data, start, count);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected abstract _parseStats(value: any, options: C): S | undefined;

  getLabelAndValue(index: number): { label: string; value: string & { raw: S; hoveredOutlierIndex: number } & S } {
    const r = super.getLabelAndValue(index) as any;
    const { vScale } = this._cachedMeta;
    const parsed = this.getParsed(index) as unknown as S;
    if (!vScale || !parsed || r.value === 'NaN') {
      return r;
    }
    r.value = {
      raw: parsed,
      hoveredOutlierIndex: -1,
    };
    this._transformStats(r.value, parsed, (v) => vScale.getLabelForValue(v));
    const s = this._toStringStats(r.value.raw);
    r.value.toString = function toString() {
      // custom to string function for the 'value'
      if (this.hoveredOutlierIndex >= 0) {
        // TODO formatter
        return `(outlier: ${this.outliers[this.hoveredOutlierIndex]})`;
      }
      return s;
    };
    return r;
  }

  // eslint-disable-next-line class-methods-use-this
  protected _toStringStats(b: S): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const f = (v: number) => (v == null ? 'NaN' : formatNumber(v, this.chart.options.locale!, {}));
    return `(min: ${f(b.min)}, 25% quantile: ${f(b.q1)}, median: ${f(b.median)}, mean: ${f(b.mean)}, 75% quantile: ${f(
      b.q3
    )}, max: ${f(b.max)})`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateElement(rectangle: Element, index: number, properties: any, mode: UpdateMode): void {
    const reset = mode === 'reset';
    const scale = this._cachedMeta.vScale as LinearScale;
    const parsed = this.getParsed(index) as unknown as S;
    const base = scale.getBasePixel();
    // eslint-disable-next-line no-param-reassign
    properties._datasetIndex = this.index;
    // eslint-disable-next-line no-param-reassign
    properties._index = index;
    this._transformStats(properties, parsed, (v) => (reset ? base : scale.getPixelForValue(v, index)));
    super.updateElement(rectangle, index, properties, mode);
  }
}
