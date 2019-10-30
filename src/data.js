'use strict';

import kde from '@sgratzl/science/src/stats/kde';

// Uses R's quantile algorithm type=7.
// https://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population
export function quantilesType7(arr) {
  const n1 = arr.length - 1;
  const compute = (q) => {
    const index = 1 + q * n1;
    const lo = Math.floor(index);
    const h = index - lo;
    const a = arr[lo - 1];

    return h === 0 ? a : a + h * (arr[lo] - a);
  };

  return {
    min: arr[0],
    q1: compute(0.25),
    median: compute(0.5),
    q3: compute(0.75),
    max: arr[n1]
  };
}

/**
 * The hinges equal the quartiles for odd n (where n <- length(x))
 * and differ for even n. Whereas the quartiles only equal observations
 * for n %% 4 == 1 (n = 1 mod 4), the hinges do so additionally
 * for n %% 4 == 2 (n = 2 mod 4), and are in the middle of
 * two observations otherwise.
 * @param {number[]} arr sorted array
 */
export function fivenum(arr) {
  // based on R fivenum
  const n = arr.length;

  // assuming R 1 index system, so arr[1] is the first element
  const n4 = Math.floor((n + 3) / 2) / 2;
  const compute = (d) => 0.5 * (arr[Math.floor(d) - 1] + arr[Math.ceil(d) - 1]);

  return {
    min: arr[0],
    q1: compute(n4),
    median: compute((n + 1) / 2),
    q3: compute(n + 1 - n4),
    max: arr[n - 1]
  };
}


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
    whiskerMax
  };
}

const defaultStatsOptions = {
  coef: 1.5,
  quantiles: 7
};

function determineStatsOptions(options) {
  const coef = options == null || typeof options.coef !== 'number' ? defaultStatsOptions.coef : options.coef;
  const q = options == null ? null : options.quantiles;
  const quantiles = typeof q === 'function' ? q : (q === 'hinges' || q === 'fivenum' ? fivenum : quantilesType7);
  return {
    coef,
    quantiles
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
      outliers: []
    };
  }

  arr = arr.filter((v) => typeof v === 'number' && !isNaN(v));
  arr.sort((a, b) => a - b);

  const {quantiles, coef} = determineStatsOptions(options);

  const stats = quantiles(arr);
  const {whiskerMin, whiskerMax} = whiskers(stats, arr, coef);
  stats.outliers = arr.filter((v) => v < whiskerMin || v > whiskerMax);
  stats.whiskerMin = whiskerMin;
  stats.whiskerMax = whiskerMax;
  return stats;
}

export function violinStats(arr, options) {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {};
  }
  arr = arr.filter((v) => typeof v === 'number' && !isNaN(v));
  arr.sort((a, b) => a - b);

  const {quantiles} = determineStatsOptions(options);

  const stats = quantiles(arr);
  stats.kde = kde().sample(arr);
  return stats;
}

export function asBoxPlotStats(value, options) {
  if (!value) {
    return null;
  }
  if (typeof value.median === 'number' && typeof value.q1 === 'number' && typeof value.q3 === 'number') {
    // sounds good, check for helper
    if (typeof value.whiskerMin === 'undefined') {
      const {coef} = determineStatsOptions(options);
      const {whiskerMin, whiskerMax} = whiskers(value, Array.isArray(value.items) ? value.items.slice().sort((a, b) => a - b) : null, coef);
      value.whiskerMin = whiskerMin;
      value.whiskerMax = whiskerMax;
    }
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  if (value.__stats === undefined) {
    value.__stats = boxplotStats(value, options);
  }
  return value.__stats;
}

export function asViolinStats(value, options) {
  if (!value) {
    return null;
  }
  if (typeof value.median === 'number' && (typeof value.kde === 'function' || Array.isArray(value.coords))) {
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  if (value.__kde === undefined) {
    value.__kde = violinStats(value, options);
  }
  return value.__kde;
}

export function asValueStats(value, minStats, maxStats, options) {
  if (typeof value[minStats] === 'number' && typeof value[maxStats] === 'number') {
    return value;
  }
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  return asBoxPlotStats(value, options);
}

export function getRightValue(rawValue, options) {
  if (!rawValue) {
    return rawValue;
  }
  if (typeof rawValue === 'number' || typeof rawValue === 'string') {
    return Number(rawValue);
  }
  const b = asBoxPlotStats(rawValue, options);
  return b ? b.median : rawValue;
}

export const commonScaleOptions = {
  ticks: {
    minStats: 'min',
    maxStats: 'max',
    ...defaultStatsOptions
  }
};

export function commonDataLimits(extraCallback) {
  const chart = this.chart;
  const isHorizontal = this.isHorizontal();
  const {minStats, maxStats} = this.options.ticks;

  const matchID = (meta) => isHorizontal ? meta.xAxisID === this.id : meta.yAxisID === this.id;

  // First Calculate the range
  this.min = null;
  this.max = null;

  // Regular charts use x, y values
  // For the boxplot chart we have rawValue.min and rawValue.max for each point
  chart.data.datasets.forEach((d, i) => {
    const meta = chart.getDatasetMeta(i);
    if (!chart.isDatasetVisible(i) || !matchID(meta)) {
      return;
    }
    d.data.forEach((value, j) => {
      if (value == null || meta.data[j].hidden) {
        return;
      }

      const stats = asValueStats(value, minStats, maxStats, this.options.ticks);
      let minValue;
      let maxValue;

      if (stats) {
        minValue = stats[minStats];
        maxValue = stats[maxStats];
      } else {
        // if stats are not available use the plain value
        const parsed = +this.getRightValue(value);
        if (isNaN(parsed)) {
          return;
        }
        minValue = maxValue = parsed;
      }

      if (this.min === null || minValue < this.min) {
        this.min = minValue;
      }

      if (this.max === null || maxValue > this.max) {
        this.max = maxValue;
      }

      if (extraCallback) {
        extraCallback(stats);
      }
    });
  });
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
