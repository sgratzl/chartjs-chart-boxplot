import boxplots, {
  quantilesFivenum,
  quantilesHigher,
  quantilesHinges,
  quantilesLinear,
  quantilesLower,
  quantilesMidpoint,
  quantilesNearest,
  quantilesType7,
} from '@sgratzl/boxplots';
import { kde } from './kde';
import { IKDEPoint } from './elements';
export {
  quantilesFivenum,
  quantilesHigher,
  quantilesHinges,
  quantilesLinear,
  quantilesLower,
  quantilesMidpoint,
  quantilesNearest,
  quantilesType7,
} from '@sgratzl/boxplots';

export interface IBaseStats {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
}

export interface IBoxPlot extends IBaseStats {
  items: readonly number[];
  outliers: readonly number[];
  whiskerMax: number;
  whiskerMin: number;
}

export interface IKDEPoint {
  v: number;
  estimate: number;
}

export interface IViolin extends IBaseStats {
  items: readonly number[];
  maxEstimate: number;
  coords: IKDEPoint[];
  outliers: readonly number[];
}

/**
 * compute the whiskers
 * @param boxplot
 * @param {number[]} arr sorted array
 * @param {number} coef
 */
export function whiskers(boxplot: IBoxPlot, arr: number[] | null, coef = 1.5) {
  const iqr = boxplot.q3 - boxplot.q1;
  // since top left is max
  const coefValid = typeof coef === 'number' && coef > 0;
  let whiskerMin = coefValid ? Math.max(boxplot.min, boxplot.q1 - coef * iqr) : boxplot.min;
  let whiskerMax = coefValid ? Math.min(boxplot.max, boxplot.q3 + coef * iqr) : boxplot.max;

  if (Array.isArray(arr)) {
    // compute the closest real element
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (v >= whiskerMin) {
        whiskerMin = v;
        break;
      }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const v = arr[i];
      if (v <= whiskerMax) {
        whiskerMax = v;
        break;
      }
    }
  }

  return {
    whiskerMin,
    whiskerMax,
  };
}

export type QuantileMethod =
  | 7
  | 'quantiles'
  | 'hinges'
  | 'fivenum'
  | 'linear'
  | 'lower'
  | 'higher'
  | 'nearest'
  | 'midpoint'
  | ((arr: ArrayLike<number>, length?: number | undefined) => { q1: number; median: number; q3: number });

export interface IBaseOptions {
  /**
   * statistic measure that should be used for computing the minimal data limit
   * @default 'min'
   */
  minStats?: 'min' | 'q1' | 'whiskerMin';

  /**
   * statistic measure that should be used for computing the maximal data limit
   * @default 'max'
   */
  maxStats?: 'max' | 'q3' | 'whiskerMax';

  /**
   * from the R doc: this determines how far the plot ‘whiskers’ extend out from
   * the box. If coef is positive, the whiskers extend to the most extreme data
   * point which is no more than coef times the length of the box away from the
   * box. A value of zero causes the whiskers to extend to the data extremes
   * @default 1.5
   */
  coef?: number;

  /**
   * the method to compute the quantiles.
   *
   * 7, 'quantiles': the type-7 method as used by R 'quantiles' method.
   * 'hinges' and 'fivenum': the method used by R 'boxplot.stats' method.
   * 'linear': the interpolation method 'linear' as used by 'numpy.percentile' function
   * 'lower': the interpolation method 'lower' as used by 'numpy.percentile' function
   * 'higher': the interpolation method 'higher' as used by 'numpy.percentile' function
   * 'nearest': the interpolation method 'nearest' as used by 'numpy.percentile' function
   * 'midpoint': the interpolation method 'midpoint' as used by 'numpy.percentile' function
   * @default 7
   */
  quantiles?: QuantileMethod;
}

export interface IBoxplotOptions extends IBaseOptions {
  // no extra options
}

export interface IViolinOptions extends IBaseOptions {
  /**
   * number of points that should be samples of the KDE
   * @default 100
   */
  points: number;
}

export const defaultStatsOptions = {
  coef: 1.5,
  quantiles: 7,
};

function determineQuantiles(q: QuantileMethod) {
  if (typeof q === 'function') {
    return q;
  }
  const lookup = {
    hinges: quantilesHinges,
    fivenum: quantilesFivenum,
    7: quantilesType7,
    quantiles: quantilesType7,
    linear: quantilesLinear,
    lower: quantilesLower,
    higher: quantilesHigher,
    nearest: quantilesNearest,
    midpoint: quantilesMidpoint,
  };
  return lookup[q] || quantilesType7;
}

function determineStatsOptions(options?: IBaseOptions) {
  const coef = options == null || typeof options.coef !== 'number' ? defaultStatsOptions.coef : options.coef;
  const q = options == null || options.quantiles == null ? quantilesType7 : options.quantiles;
  const quantiles = determineQuantiles(q);
  return {
    coef,
    quantiles,
  };
}

export function boxplotStats(arr: readonly number[] | Float32Array | Float64Array, options: IBaseOptions): IBoxPlot {
  const r = boxplots(arr, determineStatsOptions(options));
  return {
    items: Array.from(r.items),
    outliers: r.outlier,
    whiskerMax: r.whiskerHigh,
    whiskerMin: r.whiskerLow,
    max: r.max,
    median: r.median,
    min: r.min,
    q1: r.q1,
    q3: r.q3,
  };
}

export function violinStats(arr: readonly number[], options: IViolinOptions): IViolin | undefined {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return undefined;
  }
  const items = arr.filter((v) => typeof v === 'number' && !Number.isNaN(v)).sort((a, b) => a - b);

  const { quantiles } = determineStatsOptions(options);

  const stats = quantiles(items);
  const min = items[0];
  const max = items[items.length - 1];

  // generate coordinates
  const range = max - min;
  const samples = [];
  const inc = range / options.points;
  for (let v = min; v <= max && inc > 0; v += inc) {
    samples.push(v);
  }
  if (samples[samples.length - 1] !== max) {
    samples.push(max);
  }
  const coords = kde(items, samples, quantiles);
  const maxEstimate = coords.reduce((a, d) => Math.max(a, d.estimate), Number.NEGATIVE_INFINITY);

  return {
    ...stats,
    min,
    items,
    max,
    coords,
    outliers: [], // items.filter((d) => d < stats.q1 || d > stats.q3),
    maxEstimate,
  };
}

export function asBoxPlotStats(value: any, options: IBoxplotOptions) {
  if (!value) {
    return undefined;
  }
  if (typeof value.median === 'number' && typeof value.q1 === 'number' && typeof value.q3 === 'number') {
    // sounds good, check for helper
    if (typeof value.whiskerMin === 'undefined') {
      const { coef } = determineStatsOptions(options);
      const { whiskerMin, whiskerMax } = whiskers(
        value,
        Array.isArray(value.items) ? (value.items as number[]).slice().sort((a, b) => a - b) : null,
        coef
      );
      value.whiskerMin = whiskerMin;
      value.whiskerMax = whiskerMax;
    }
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  return boxplotStats(value, options);
}

export function asViolinStats(value: any, options: IViolinOptions) {
  if (!value) {
    return undefined;
  }
  if (typeof value.median === 'number' && Array.isArray(value.coords)) {
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  return violinStats(value, options);
}

export function rnd(seed = Date.now()) {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
