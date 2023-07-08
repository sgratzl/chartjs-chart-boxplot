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
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { asBoxPlotStats, IBoxPlot, IBoxplotOptions } from '../data';
import { baseDefaults, StatsBase, defaultOverrides } from './StatsBase';
import { BoxAndWiskers, IBoxAndWhiskersOptions } from '../elements';
import patchController from './patchController';
import { boxOptionsKeys } from '../elements/BoxAndWiskers';

export class BoxPlotController extends StatsBase<IBoxPlot, Required<IBoxplotOptions>> {
  /**
   * @internal
   */
  // eslint-disable-next-line class-methods-use-this
  protected _parseStats(value: unknown, config: IBoxplotOptions): IBoxPlot | undefined {
    return asBoxPlotStats(value, config);
  }

  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected _transformStats<T>(target: any, source: IBoxPlot, mapper: (v: number) => T): void {
    super._transformStats(target, source, mapper);
    for (const key of ['whiskerMin', 'whiskerMax']) {
      // eslint-disable-next-line no-param-reassign
      target[key] = mapper(source[key as 'whiskerMin' | 'whiskerMax']);
    }
  }

  static readonly id = 'boxplot';

  /**
   * @internal
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
   * @internal
   */
  static readonly overrides: any = /* #__PURE__ */ merge({}, [(BarController as any).overrides, defaultOverrides()]);
}

export interface BoxPlotControllerDatasetOptions
  extends ControllerDatasetOptions,
    IBoxplotOptions,
    ScriptableAndArrayOptions<IBoxAndWhiskersOptions, ScriptableContext<'boxplot'>>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'boxplot'>>,
    AnimationOptions<'boxplot'> {}

export type BoxPlotDataPoint = number[] | (Partial<IBoxPlot> & Pick<IBoxPlot, 'min' | 'max' | 'median' | 'q1' | 'q3'>);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBoxPlotChartOptions extends IBoxplotOptions {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    boxplot: {
      chartOptions: IBoxPlotChartOptions;
      datasetOptions: BoxPlotControllerDatasetOptions;
      defaultDataPoint: BoxPlotDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: {};
      parsedDataType: IBoxPlot & ChartTypeRegistry['bar']['parsedDataType'];
    };
  }
}

export class BoxPlotChart<DATA extends unknown[] = BoxPlotDataPoint[], LABEL = string> extends Chart<
  'boxplot',
  DATA,
  LABEL
> {
  /**
   * @internal
   */
  static id = BoxPlotController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'boxplot', DATA, LABEL>, 'type'>) {
    super(item, patchController('boxplot', config, BoxPlotController, BoxAndWiskers, [LinearScale, CategoryScale]));
  }
}
