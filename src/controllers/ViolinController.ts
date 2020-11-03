import { asViolinStats, IBaseStats, IViolin, IViolinOptions } from '../data';
import {
  Chart,
  BarController,
  ChartItem,
  IControllerDatasetOptions,
  ScriptableAndArrayOptions,
  ICommonHoverOptions,
  IChartConfiguration,
  LinearScale,
  CategoryScale,
  ICartesianScaleTypeRegistry,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { StatsBase, baseDefaults } from './base';
import { baseOptionKeys } from '../elements/base';
import { IViolinElementOptions, Violin } from '../elements';
import { interpolateKdeCoords } from '../animation';
import patchController from './patchController';

export class ViolinController extends StatsBase<IViolin, Required<IViolinOptions>> {
  _parseStats(value: any, config: IViolinOptions) {
    return asViolinStats(value, config);
  }

  _toStringStats(v: IViolin) {
    return `(min: ${v.min}, 25% quantile: ${v.q1}, median: ${v.median}, 75% quantile: ${v.q3}, max: ${v.max})`;
  }

  _transformStats<T>(target: any, source: IViolin, mapper: (v: number) => T) {
    for (const key of ['min', 'max', 'median', 'q3', 'q1']) {
      target[key] = mapper(source[key as 'min' | 'max' | 'median' | 'q3' | 'q1']);
    }
    target.maxEstimate = source.maxEstimate;
    for (const key of ['items', 'outliers']) {
      if (Array.isArray(source[key as keyof IViolin])) {
        target[key] = source[key as 'items' | 'outliers'].map(mapper);
      }
    }
    if (Array.isArray(source.coords)) {
      target.coords = source.coords.map((coord) => Object.assign({}, coord, { v: mapper(coord.v) }));
    }
  }

  static readonly id = 'violin';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    BarController.defaults,
    baseDefaults(baseOptionKeys),
    {
      datasets: {
        points: 100,
        animation: {
          numbers: {
            type: 'number',
            properties: BarController.defaults.datasets.animation.numbers.properties.concat(
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
      dataElementType: Violin.id,
      dataElementOptions: BarController.defaults.dataElementOptions.concat(baseOptionKeys),
    },
  ]);
}

export interface IViolinControllerDatasetOptions
  extends IControllerDatasetOptions,
    IViolinOptions,
    ScriptableAndArrayOptions<IViolinElementOptions>,
    ScriptableAndArrayOptions<ICommonHoverOptions> {}

export type IViolinDataPoint = number[] | (Partial<IViolin> & IBaseStats);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IViolinChartOptions {}

declare module 'chart.js' {
  export interface IChartTypeRegistry {
    violin: {
      chartOptions: IViolinChartOptions;
      datasetOptions: IViolinControllerDatasetOptions;
      defaultDataPoint: IViolinDataPoint[];
      scales: keyof ICartesianScaleTypeRegistry;
    };
  }
}

export class ViolinChart<DATA extends unknown[] = IViolinDataPoint[], LABEL = string> extends Chart<
  'violin',
  DATA,
  LABEL
> {
  static id = ViolinController.id;

  constructor(item: ChartItem, config: Omit<IChartConfiguration<'violin', DATA, LABEL>, 'type'>) {
    super(item, patchController('violin', config, ViolinController, Violin, [LinearScale, CategoryScale]));
  }
}
