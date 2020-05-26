const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export class Samples {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  constructor(seed) {
    this._seed = seed;
  }

  randF(min, max) {
    min = min === undefined ? 0 : min;
    max = max === undefined ? 1 : max;
    return () => {
      this._seed = (this._seed * 9301 + 49297) % 233280;
      return min + (this._seed / 233280) * (max - min);
    };
  }

  rand(min, max) {
    return this.randF(min, max)();
  }

  months(config) {
    const cfg = config || {};
    const count = cfg.count || 12;
    const section = cfg.section;
    const values = [];

    for (let i = 0; i < count; ++i) {
      const value = Months[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  }

  numbers(config) {
    const cfg = config || {};
    const min = cfg.min || 0;
    const max = cfg.max || 100;
    const from = cfg.from || [];
    const count = cfg.count || 8;
    const decimals = cfg.decimals || 8;
    const continuity = cfg.continuity || 1;
    const dfactor = Math.pow(10, decimals) || 0;
    const data = [];
    const rand = cfg.random ? cfg.random(min, max) : this.randF(min, max);
    const rand01 = cfg.random01 ? cfg.random01() : this.randF();

    for (let i = 0; i < count; ++i) {
      const value = (from[i] || 0) + rand();
      if (rand01() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }

    return data;
  }

  randomBoxPlot(config) {
    const base = this.numbers({ ...config, count: 10 });
    base.sort((a, b) => a - b);
    const shift = 3;
    return {
      min: base[shift + 0],
      q1: base[shift + 1],
      median: base[shift + 2],
      q3: base[shift + 3],
      max: base[shift + 4],
      outliers: base.slice(0, 3).concat(base.slice(shift + 5)),
    };
  }

  boxplots(config) {
    const count = (config || {}).count || 8;
    const data = [];
    for (let i = 0; i < count; ++i) {
      data.push(this.randomBoxPlot(config));
    }
    return data;
  }

  boxplotsArray(config) {
    const count = (config || {}).count || 8;
    const data = [];
    for (let i = 0; i < count; ++i) {
      data.push(this.numbers({ ...config, count: 50 }));
    }
    return data;
  }

  labels(config) {
    const cfg = config || {};
    const min = cfg.min || 0;
    const max = cfg.max || 100;
    const count = cfg.count || 8;
    const step = (max - min) / count;
    const decimals = cfg.decimals || 8;
    const dfactor = Math.pow(10, decimals) || 0;
    const prefix = cfg.prefix || '';
    const values = [];
    for (let i = min; i < max; i += step) {
      values.push(prefix + Math.round(dfactor * i) / dfactor);
    }

    return values;
  }
}
