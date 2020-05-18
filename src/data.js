import kde from '@sgratzl/science/src/stats/kde';

/**
 * computes the boxplot stats using the given interpolation function if needed
 * @param {number[]} arr sorted array of number
 * @param {(i: number, j: number, fraction: number)} interpolate interpolation function
 */
function quantilesInterpolate(arr, interpolate) {
  const n1 = arr.length - 1;
  const compute = (q) => {
    const index = q * n1;
    const lo = Math.floor(index);
    const h = index - lo;
    const a = arr[lo];

    return h === 0 ? a : interpolate(a, arr[Math.min(lo + 1, n1)], h);
  };

  return {
    min: arr[0],
    q1: compute(0.25),
    median: compute(0.5),
    q3: compute(0.75),
    max: arr[n1],
  };
}

/**
 * Uses R's quantile algorithm type=7.
 * https://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population
 */
export function quantilesType7(arr) {
  return quantilesInterpolate(arr, (a, b, alpha) => a + alpha * (b - a));
}

/**
 * ‘linear’: i + (j - i) * fraction, where fraction is the fractional part of the index surrounded by i and j.
 * (same as type 7)
 */
export function quantilesLinear(arr) {
  return quantilesInterpolate(arr, (i, j, fraction) => i + (j - i) * fraction);
}

/**
 * ‘lower’: i.
 */
export function quantilesLower(arr) {
  return quantilesInterpolate(arr, (i) => i);
}

/**
 * 'higher': j.
 */
export function quantilesHigher(arr) {
  return quantilesInterpolate(arr, (_, j) => j);
}

/**
 * ‘nearest’: i or j, whichever is nearest
 */
export function quantilesNearest(arr) {
  return quantilesInterpolate(arr, (i, j, fraction) => (fraction < 0.5 ? i : j));
}

/**
 * ‘midpoint’: (i + j) / 2
 */
export function quantilesMidpoint(arr) {
  return quantilesInterpolate(arr, (i, j) => (i + j) * 0.5);
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
    max: arr[n - 1],
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
