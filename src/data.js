'use strict';

import {
  quantile,
  extent
} from 'd3-array';
import kde from 'science/src/stats/kde';

export function whiskers(boxplot, arr) {
  const iqr = boxplot.q3 - boxplot.q1;
  // since top left is max
  let whiskerMin = Math.max(boxplot.min, boxplot.q1 - iqr);
  let whiskerMax = Math.min(boxplot.max, boxplot.q3 + iqr);

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

export function boxplotStats(arr) {
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

  const minmax = extent(arr);
  const base = {
    min: minmax[0],
    max: minmax[1],
    median: quantile(arr, 0.5),
    q1: quantile(arr, 0.25),
    q3: quantile(arr, 0.75),
    outliers: []
  };
  const {
    whiskerMin,
    whiskerMax
  } = whiskers(base, arr);
  base.outliers = arr.filter((v) => v < whiskerMin || v > whiskerMax);
  base.whiskerMin = whiskerMin;
  base.whiskerMax = whiskerMax;
  return base;
}

export function violinStats(arr) {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {
      outliers: []
    };
  }
  arr = arr.filter((v) => typeof v === 'number' && !isNaN(v));
  arr.sort((a, b) => a - b);

  const minmax = extent(arr);
  return {
    min: minmax[0],
    max: minmax[1],
    median: quantile(arr, 0.5),
    kde: kde().sample(arr)
  };
}

export function asBoxPlotStats(value) {
  if (!value) {
    return null;
  }
  if (typeof value.median === 'number' && typeof value.q1 === 'number' && typeof value.q3 === 'number') {
    // sounds good, check for helper
    if (typeof value.whiskerMin === 'undefined') {
      const {
        whiskerMin,
        whiskerMax
      } = whiskers(value, Array.isArray(value.items) ? value.items.slice().sort((a, b) => a - b) : null);
      value.whiskerMin = whiskerMin;
      value.whiskerMax = whiskerMax;
    }
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  if (value.__stats === undefined) {
    value.__stats = boxplotStats(value);
  }
  return value.__stats;
}

export function asViolinStats(value) {
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
    value.__kde = violinStats(value);
  }
  return value.__kde;
}

export function asValueStats(value, minStats, maxStats) {
  if (typeof value[minStats] === 'number' && typeof value[maxStats] === 'number') {
    return value;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  return asBoxPlotStats(value);
}

export function getRightValue(rawValue) {
  if (!rawValue) {
    return rawValue;
  }
  if (typeof rawValue === 'number' || typeof rawValue === 'string') {
    return Number(rawValue);
  }
  const b = asBoxPlotStats(rawValue);
  return b ? b.median : rawValue;
}

export const commonScaleOptions = {
  ticks: {
    minStats: 'min',
    maxStats: 'max'
  }
};

export function commonDataLimits(extraCallback) {
  const chart = this.chart;
  const isHorizontal = this.isHorizontal();
  const tickOpts = this.options.ticks;
  const minStats = tickOpts.minStats;
  const maxStats = tickOpts.maxStats;

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
      if (!value || meta.data[j].hidden) {
        return;
      }
      const stats = asValueStats(value, minStats, maxStats);
      if (!stats) {
        return;
      }

      if (this.min === null || stats[minStats] < this.min) {
        this.min = stats[minStats];
      }

      if (this.max === null || stats[maxStats] > this.max) {
        this.max = stats[maxStats];
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
