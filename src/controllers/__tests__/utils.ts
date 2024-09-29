import type { BoxPlotDataPoint } from '../BoxPlotController';

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

export interface INumberOptions {
  decimals?: number;
  min?: number;
  max?: number;
  continuity?: number;
  from?: number[];
  count?: number;
  random?(min: number, max: number): () => number;
  random01?(): () => number;
}

export class Samples {
  _seed;

  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  constructor(seed = 0) {
    this._seed = seed;
  }

  randF(min = 0, max = 1): () => number {
    return () => {
      this._seed = (this._seed * 9301 + 49297) % 233280;
      return min + (this._seed / 233280) * (max - min);
    };
  }

  rand(min?: number, max?: number): number {
    return this.randF(min, max)();
  }

  months({ count = 12, section }: { count?: number; section?: number }): string[] {
    const values: string[] = [];

    for (let i = 0; i < count; i += 1) {
      const value = Months[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  }

  numbers({
    count = 8,
    min = 0,
    max = 100,
    decimals = 8,
    from = [],
    continuity = 1,
    random,
    random01,
  }: INumberOptions = {}): number[] {
    const dfactor = Math.pow(10, decimals) || 0;
    const data: number[] = [];
    const rand = random ? random(min, max) : this.randF(min, max);
    const rand01 = random01 ? random01() : this.randF();
    for (let i = 0; i < count; i += 1) {
      const value = (from[i] || 0) + rand();
      if (rand01() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(Number.NaN);
      }
    }

    return data;
  }

  randomBoxPlot(config: INumberOptions = {}): BoxPlotDataPoint {
    const base = this.numbers({ ...config, count: 10 }) as number[];
    base.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      return a! < b! ? -1 : 1;
    });
    const shift = 3;
    return {
      min: base[shift + 0]!,
      q1: base[shift + 1]!,
      median: base[shift + 2]!,
      q3: base[shift + 3]!,
      max: base[shift + 4]!,
      items: base,
      mean: base.reduce((acc, v) => acc + v, 0) / base.length,
      outliers: base.slice(0, 3).concat(base.slice(shift + 5)),
    };
  }

  boxplots(config: INumberOptions = {}): BoxPlotDataPoint[] {
    const count = config.count || 8;
    return Array(count)
      .fill(0)
      .map(() => this.randomBoxPlot(config));
  }

  boxplotsArray(config: INumberOptions = {}): number[][] {
    const count = config.count || 8;
    return Array(count)
      .fill(0)
      .map(() => this.numbers({ ...config, count: 50 }) as number[]);
  }

  labels({
    min = 0,
    max = 100,
    count = 8,
    decimals = 8,
    prefix = '',
  }: { min?: number; max?: number; count?: number; decimals?: number; prefix?: string } = {}): string[] {
    const step = (max - min) / count;
    const dfactor = Math.pow(10, decimals) || 0;
    const values: string[] = [];
    for (let i = min; i < max; i += step) {
      values.push(prefix + Math.round(dfactor * i) / dfactor);
    }
    return values;
  }
}
