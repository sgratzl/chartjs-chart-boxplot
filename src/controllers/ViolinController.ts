import { asViolinStats, IBaseStats, IViolin, IViolinOptions } from '../data';
import {
  Chart,
  merge,
  BarController,
  ChartItem,
  IControllerDatasetOptions,
  ScriptableAndArrayOptions,
  ICommonHoverOptions,
  IChartDataset,
  IChartConfiguration,
} from '@sgratzl/chartjs-esm-facade';
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
    for (const key of ['items']) {
      if (Array.isArray(source[key as keyof IViolin])) {
        target[key] = source[key as 'items'].map(mapper);
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

export type IViolinControllerDataset<T = IViolinDataPoint> = IChartDataset<T, IViolinControllerDatasetOptions>;

export interface IViolinChartOptions {}

export type IViolinControllerConfiguration<T = IViolinDataPoint, L = string> = IChartConfiguration<
  'violin',
  T,
  L,
  IViolinControllerDataset<T>,
  IViolinChartOptions
>;

export class ViolinChart<T = IViolinDataPoint, L = string> extends Chart<T, L, IViolinControllerConfiguration<T, L>> {
  static id = ViolinController.id;

  constructor(item: ChartItem, config: Omit<IViolinControllerConfiguration<T, L>, 'type'>) {
    super(item, patchController('violin', config, ViolinController, Violin, []));
  }
}
