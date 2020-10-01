import { asBoxPlotStats, IBaseStats, IBoxPlot, IBoxplotOptions } from '../data';
import {
  Chart,
  BarController,
  IControllerDatasetOptions,
  ScriptableAndArrayOptions,
  ICommonHoverOptions,
  ChartItem,
  IChartConfiguration,
  LinearScale,
  CategoryScale,
  ICartesianScaleTypeRegistry,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { baseDefaults, StatsBase } from './base';
import { BoxAndWiskers, IBoxAndWhiskersOptions } from '../elements';
import patchController from './patchController';
import { boxOptionsKeys } from '../elements/BoxAndWiskers';

export class BoxPlotController extends StatsBase<IBoxPlot, Required<IBoxplotOptions>> {
  _parseStats(value: any, config: IBoxplotOptions) {
    return asBoxPlotStats(value, config);
  }

  _toStringStats(b: IBoxPlot) {
    return `(min: ${b.min}, 25% quantile: ${b.q1}, median: ${b.median}, 75% quantile: ${b.q3}, max: ${b.max})`;
  }

  _transformStats<T>(target: any, source: IBoxPlot, mapper: (v: number) => T) {
    for (const key of ['min', 'max', 'median', 'q3', 'q1', 'whiskerMin', 'whiskerMax']) {
      target[key] = mapper(source[key as 'min' | 'max' | 'median' | 'q3' | 'q1' | 'whiskerMin' | 'whiskerMax']);
    }
    for (const key of ['outliers', 'items']) {
      if (Array.isArray(source[key as keyof IBoxPlot])) {
        target[key] = source[key as 'outliers' | 'items'].map(mapper);
      }
    }
  }

  static readonly id = 'boxplot';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    BarController.defaults,
    baseDefaults(boxOptionsKeys),
    {
      datasets: {
        animation: {
          numbers: {
            type: 'number',
            properties: BarController.defaults.datasets.animation.numbers.properties.concat(
              ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax'],
              boxOptionsKeys.filter((c) => !c.endsWith('Color'))
            ),
          },
        },
      },
      dataElementType: BoxAndWiskers.id,
      dataElementOptions: BarController.defaults.dataElementOptions.concat(boxOptionsKeys),
    },
  ]);
}

export interface IBoxPlotControllerDatasetOptions
  extends IControllerDatasetOptions,
    IBoxplotOptions,
    ScriptableAndArrayOptions<IBoxAndWhiskersOptions>,
    ScriptableAndArrayOptions<ICommonHoverOptions> {}

export type IBoxPlotDataPoint = number[] | (Partial<IBoxPlot> & IBaseStats);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBoxPlotChartOptions {}

declare module 'chart.js' {
  export enum ChartTypeEnum {
    boxplot = 'boxplot',
  }

  export interface IChartTypeRegistry {
    boxplot: {
      chartOptions: IBoxPlotChartOptions;
      datasetOptions: IBoxPlotControllerDatasetOptions;
      defaultDataPoint: IBoxPlotDataPoint[];
      scales: keyof ICartesianScaleTypeRegistry;
    };
  }
}

export class BoxPlotChart<DATA extends unknown[] = IBoxPlotDataPoint[], LABEL = string> extends Chart<
  'boxplot',
  DATA,
  LABEL
> {
  static id = BoxPlotController.id;

  constructor(item: ChartItem, config: Omit<IChartConfiguration<'boxplot', DATA, LABEL>, 'type'>) {
    super(item, patchController('boxplot', config, BoxPlotController, BoxAndWiskers, [LinearScale, CategoryScale]));
  }
}
