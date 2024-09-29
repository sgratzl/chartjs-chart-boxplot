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
  AnimationOptions,
  ScriptableContext,
  CartesianScaleTypeRegistry,
  BarControllerDatasetOptions,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { asBoxPlotStats, IBoxPlot, IBoxplotOptions } from '../data';
import { baseDefaults, StatsBase, defaultOverrides } from './StatsBase';
import { BoxAndWiskers, IBoxAndWhiskersOptions } from '../elements';
import patchController from './patchController';
import { boxOptionsKeys } from '../elements/BoxAndWiskers';

export class BoxPlotController extends StatsBase<IBoxPlot, Required<IBoxplotOptions>> {
  /**
   * @hidden
   */

  protected _parseStats(value: unknown, config: IBoxplotOptions): IBoxPlot | undefined {
    return asBoxPlotStats(value, config);
  }

  /**
   * @hidden
   */

  protected _transformStats<T>(target: any, source: IBoxPlot, mapper: (v: number) => T): void {
    super._transformStats(target, source, mapper);
    for (const key of ['whiskerMin', 'whiskerMax']) {
      target[key] = mapper(source[key as 'whiskerMin' | 'whiskerMax']);
    }
  }

  static readonly id = 'boxplot';

  /**
   * @hidden
   */
  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    BarController.defaults,
    baseDefaults(boxOptionsKeys),
    {
      animations: {
        numbers: {
          type: 'number',
          properties: (BarController.defaults as any).animations.numbers.properties.concat(
            ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax', 'mean'],
            boxOptionsKeys.filter((c) => !c.endsWith('Color'))
          ),
        },
      },
      dataElementType: BoxAndWiskers.id,
    },
  ]);

  /**
   * @hidden
   */
  static readonly overrides: any = /* #__PURE__ */ merge({}, [(BarController as any).overrides, defaultOverrides()]);
}

export interface BoxPlotControllerDatasetOptions
  extends ControllerDatasetOptions,
    Pick<
      BarControllerDatasetOptions,
      'barPercentage' | 'barThickness' | 'categoryPercentage' | 'maxBarThickness' | 'minBarLength'
    >,
    IBoxplotOptions,
    ScriptableAndArrayOptions<IBoxAndWhiskersOptions, ScriptableContext<'boxplot'>>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'boxplot'>>,
    AnimationOptions<'boxplot'> {}

export type BoxPlotDataPoint = number[] | (Partial<IBoxPlot> & Pick<IBoxPlot, 'min' | 'max' | 'median' | 'q1' | 'q3'>);

export type IBoxPlotChartOptions = IBoxplotOptions;

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    boxplot: {
      chartOptions: IBoxPlotChartOptions;
      datasetOptions: BoxPlotControllerDatasetOptions;
      defaultDataPoint: BoxPlotDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: object;
      parsedDataType: IBoxPlot & ChartTypeRegistry['bar']['parsedDataType'];
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
