import kde from '@sgratzl/science/src/stats/kde';
import {} from '@sgratzl/boxplots';

/**
 * compute the whiskers
 * @param boxplot
 * @param {number[]} arr sorted array
 * @param {number} coef
 */
export function whiskers(boxplot, arr, coef = 1.5) {
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

export const defaultStatsOptions = {
  coef: 1.5,
  quantiles: 7,
};

function determineQuantiles(q) {
  if (typeof q === 'function') {
    return q;
  }
  const lookup = {
    hinges: fivenum,
    fivenum: fivenum,
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

function determineStatsOptions(options) {
  const coef = options == null || typeof options.coef !== 'number' ? defaultStatsOptions.coef : options.coef;
  const q = options == null ? null : options.quantiles;
  const quantiles = determineQuantiles(q);
  return {
    coef,
    quantiles,
  };
}

export function boxplotStats(arr, options) {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {
      min: NaN,
      max: NaN,
      median: NaN,
      q1: NaN,
      q3: NaN,
      whiskerMin: NaN,
      whiskerMax: NaN,
      outliers: [],
    };
  }

  arr = arr.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  arr.sort((a, b) => a - b);

  const { quantiles, coef } = determineStatsOptions(options);

  const stats = quantiles(arr);
  const { whiskerMin, whiskerMax } = whiskers(stats, arr, coef);
  stats.outliers = arr.filter((v) => v < whiskerMin || v > whiskerMax);
  stats.whiskerMin = whiskerMin;
  stats.whiskerMax = whiskerMax;
  stats.items = arr;
  return stats;
}

export function violinStats(arr, options) {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {};
  }
  arr = arr.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  arr.sort((a, b) => a - b);

  const { quantiles } = determineStatsOptions(options);

  const stats = quantiles(arr);
  const kdeGen = kde().sample(arr);
  // generate coordinates
  const range = stats.max - stats.min;
  const samples = [];
  const inc = range / options.points;
  for (let v = stats.min; v <= stats.max && inc > 0; v += inc) {
    samples.push(v);
  }
  if (samples[samples.length - 1] !== stats.max) {
    samples.push(stats.max);
  }
  stats.items = arr;
  stats.coords = kdeGen(samples).map((v) => ({ v: v[0], estimate: v[1] }));
  stats.maxEstimate = stats.coords.reduce((a, d) => Math.max(a, d.estimate), Number.NEGATIVE_INFINITY);

  return stats;
}

export function asBoxPlotStats(value, options) {
  if (!value) {
    return null;
  }
  if (typeof value.median === 'number' && typeof value.q1 === 'number' && typeof value.q3 === 'number') {
    // sounds good, check for helper
    if (typeof value.whiskerMin === 'undefined') {
      const { coef } = determineStatsOptions(options);
      const { whiskerMin, whiskerMax } = whiskers(
        value,
        Array.isArray(value.items) ? value.items.slice().sort((a, b) => a - b) : null,
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

export function asViolinStats(value, options) {
  if (!value) {
    return null;
  }
  if (typeof value.median === 'number' && Array.isArray(value.coords)) {
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  return violinStats(value, options);
}

export function rnd(seed) {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  if (seed === undefined) {
    seed = Date.now();
  }
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
