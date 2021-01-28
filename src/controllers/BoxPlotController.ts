import { asBoxPlotStats, IBaseStats, IBoxPlot, IBoxplotOptions } from '../data';
import {
  Chart,
  BarController,
  ControllerDatasetOptions,
  ScriptableAndArrayOptions,
  CommonHoverOptions,
  ChartItem,
  ChartConfiguration,
  LinearScale,
  CategoryScale,
  CartesianScaleTypeRegistry,
  ScriptableContext,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { baseDefaults, StatsBase } from './base';
import { BoxAndWiskers, IBoxAndWhiskersOptions } from '../elements';
import patchController from './patchController';
import { boxOptionsKeys } from '../elements/BoxAndWiskers';

export class BoxPlotController extends StatsBase<IBoxPlot, Required<IBoxplotOptions>> {
  protected _parseStats(value: any, config: IBoxplotOptions) {
    return asBoxPlotStats(value, config);
  }

  protected _transformStats<T>(target: any, source: IBoxPlot, mapper: (v: number) => T) {
    super._transformStats(target, source, mapper);
    for (const key of ['whiskerMin', 'whiskerMax']) {
      target[key] = mapper(source[key as 'whiskerMin' | 'whiskerMax']);
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
              ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax', 'mean'],
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

export interface BoxPlotControllerDatasetOptions
  extends ControllerDatasetOptions,
    IBoxplotOptions,
    ScriptableAndArrayOptions<IBoxAndWhiskersOptions, ScriptableContext>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext> {}

export type BoxPlotDataPoint = number[] | (Partial<IBoxPlot> & IBaseStats);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBoxPlotChartOptions {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    boxplot: {
      chartOptions: IBoxPlotChartOptions;
      datasetOptions: BoxPlotControllerDatasetOptions;
      defaultDataPoint: BoxPlotDataPoint[];
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class BoxPlotChart<DATA extends unknown[] = BoxPlotDataPoint[], LABEL = string> extends Chart<
  'boxplot',
  DATA,
  LABEL
> {
  static id = BoxPlotController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'boxplot', DATA, LABEL>, 'type'>) {
    super(item, patchController('boxplot', config, BoxPlotController, BoxAndWiskers, [LinearScale, CategoryScale]));
  }
}
