import {
  Chart,
  BarController,
  ChartItem,
  ControllerDatasetOptions,
  ScriptableAndArrayOptions,
  CommonHoverOptions,
  ChartConfiguration,
  LinearScale,
  CategoryScale,
  AnimationOptions,
  ScriptableContext,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import { asViolinStats, IViolin, IViolinOptions } from '../data';
import { StatsBase, baseDefaults, defaultOverrides } from './StatsBase';
import { baseOptionKeys } from '../elements/base';
import { IViolinElementOptions, Violin } from '../elements';
import { interpolateKdeCoords } from '../animation';
import patchController from './patchController';

export class ViolinController extends StatsBase<IViolin, Required<IViolinOptions>> {
  /**
   * @hidden
   */
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/explicit-module-boundary-types
  protected _parseStats(value: any, config: IViolinOptions): IViolin | undefined {
    return asViolinStats(value, config);
  }

  /**
   * @hidden
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected _transformStats<T>(target: any, source: IViolin, mapper: (v: number) => T): void {
    super._transformStats(target, source, mapper);
    // eslint-disable-next-line no-param-reassign
    target.maxEstimate = source.maxEstimate;
    if (Array.isArray(source.coords)) {
      // eslint-disable-next-line no-param-reassign
      target.coords = source.coords.map((c) => ({ ...c, v: mapper(c.v) }));
    }
  }

  static readonly id = 'violin';

  /**
   * @hidden
   */
  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    BarController.defaults,
    baseDefaults(baseOptionKeys),
    {
      points: 100,
      animations: {
        numbers: {
          type: 'number',
          properties: (BarController.defaults as any).animations.numbers.properties.concat(
            ['q1', 'q3', 'min', 'max', 'median', 'maxEstimate'],
            baseOptionKeys.filter((c) => !c.endsWith('Color'))
          ),
        },
        kdeCoords: {
          fn: interpolateKdeCoords,
          properties: ['coords'],
        },
      },
      dataElementType: Violin.id,
    },
  ]);

  /**
   * @hidden
   */
  static readonly overrides: any = /* #__PURE__ */ merge({}, [(BarController as any).overrides, defaultOverrides()]);
}
export type ViolinDataPoint = number[] | (Partial<IViolin> & Pick<IViolin, 'median' | 'coords'>);

export interface ViolinControllerDatasetOptions
  extends ControllerDatasetOptions,
    IViolinOptions,
    ScriptableAndArrayOptions<IViolinElementOptions, ScriptableContext<'violin'>>,
    ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'violin'>>,
    AnimationOptions<'violin'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IViolinChartOptions extends IViolinOptions {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    violin: {
      chartOptions: IViolinChartOptions;
      datasetOptions: ViolinControllerDatasetOptions;
      defaultDataPoint: ViolinDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: {};
      parsedDataType: IViolin & ChartTypeRegistry['bar']['parsedDataType'];
    };
  }
}

export class ViolinChart<DATA extends unknown[] = ViolinDataPoint[], LABEL = string> extends Chart<
  'violin',
  DATA,
  LABEL
> {
  static id = ViolinController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'violin', DATA, LABEL>, 'type'>) {
    super(item, patchController('violin', config, ViolinController, Violin, [LinearScale, CategoryScale]));
  }
}
