import { BarElement, ChartType, CommonHoverOptions, ScriptableAndArrayOptions, ScriptableContext } from 'chart.js';
import {
  StatsBase,
  baseDefaults,
  baseOptionKeys,
  baseRoutes,
  type IStatsBaseOptions,
  type IStatsBaseProps,
} from './base';
/**
 * @hidden
 */
export const boxOptionsKeys = baseOptionKeys.concat(['medianColor', 'lowerBackgroundColor']);

export interface IBoxAndWhiskersOptions extends IStatsBaseOptions {
  /**
   * separate color for the median line
   * @default 'transparent' takes the current borderColor
   * scriptable
   * indexable
   */
  medianColor: string;

  /**
   * color the lower half (median-q3) of the box in a different color
   * @default 'transparent' takes the current borderColor
   * scriptable
   * indexable
   */
  lowerBackgroundColor: string;
}

export interface IBoxAndWhiskerProps extends IStatsBaseProps {
  q1: number;
  q3: number;
  median: number;
  whiskerMin: number;
  whiskerMax: number;
  mean: number;
}

export class BoxAndWiskers extends StatsBase<IBoxAndWhiskerProps, IBoxAndWhiskersOptions> {
  /**
   * @hidden
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    this._drawBoxPlot(ctx);
    this._drawOutliers(ctx);
    this._drawMeanDot(ctx);

    ctx.restore();

    this._drawItems(ctx);
  }

  /**
   * @hidden
   */
  protected _drawBoxPlot(ctx: CanvasRenderingContext2D): void {
    if (this.isVertical()) {
      this._drawBoxPlotVertical(ctx);
    } else {
      this._drawBoxPlotHorizontal(ctx);
    }
  }

  /**
   * @hidden
   */
  protected _drawBoxPlotVertical(ctx: CanvasRenderingContext2D): void {
    const { options } = this;
    const props = this.getProps(['x', 'width', 'q1', 'q3', 'median', 'whiskerMin', 'whiskerMax']);

    const { x } = props;
    const { width } = props;
    const x0 = x - width / 2;
    // Draw the q1>q3 box
    if (props.q3 > props.q1) {
      ctx.fillRect(x0, props.q1, width, props.q3 - props.q1);
    } else {
      ctx.fillRect(x0, props.q3, width, props.q1 - props.q3);
    }

    // Draw the median line
    ctx.save();
    if (options.medianColor && options.medianColor !== 'transparent' && options.medianColor !== '#0000') {
      ctx.strokeStyle = options.medianColor;
    }
    ctx.beginPath();
    ctx.moveTo(x0, props.median);
    ctx.lineTo(x0 + width, props.median);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    // fill the part below the median with lowerColor
    if (
      options.lowerBackgroundColor &&
      options.lowerBackgroundColor !== 'transparent' &&
      options.lowerBackgroundColor !== '#0000'
    ) {
      ctx.fillStyle = options.lowerBackgroundColor;
      if (props.q3 > props.q1) {
        ctx.fillRect(x0, props.median, width, props.q3 - props.median);
      } else {
        ctx.fillRect(x0, props.median, width, props.q1 - props.median);
      }
    }
    ctx.restore();

    // Draw the border around the main q1>q3 box
    if (props.q3 > props.q1) {
      ctx.strokeRect(x0, props.q1, width, props.q3 - props.q1);
    } else {
      ctx.strokeRect(x0, props.q3, width, props.q1 - props.q3);
    }

    // Draw the whiskers
    ctx.beginPath();
    ctx.moveTo(x0, props.whiskerMin);
    ctx.lineTo(x0 + width, props.whiskerMin);
    ctx.moveTo(x, props.whiskerMin);
    ctx.lineTo(x, props.q1);
    ctx.moveTo(x0, props.whiskerMax);
    ctx.lineTo(x0 + width, props.whiskerMax);
    ctx.moveTo(x, props.whiskerMax);
    ctx.lineTo(x, props.q3);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * @hidden
   */
  protected _drawBoxPlotHorizontal(ctx: CanvasRenderingContext2D): void {
    const { options } = this;
    const props = this.getProps(['y', 'height', 'q1', 'q3', 'median', 'whiskerMin', 'whiskerMax']);

    const { y } = props;
    const { height } = props;
    const y0 = y - height / 2;

    // Draw the q1>q3 box
    if (props.q3 > props.q1) {
      ctx.fillRect(props.q1, y0, props.q3 - props.q1, height);
    } else {
      ctx.fillRect(props.q3, y0, props.q1 - props.q3, height);
    }

    // Draw the median line
    ctx.save();
    if (options.medianColor && options.medianColor !== 'transparent') {
      ctx.strokeStyle = options.medianColor;
    }
    ctx.beginPath();
    ctx.moveTo(props.median, y0);
    ctx.lineTo(props.median, y0 + height);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    // fill the part below the median with lowerColor
    if (options.lowerBackgroundColor && options.lowerBackgroundColor !== 'transparent') {
      ctx.fillStyle = options.lowerBackgroundColor;
      if (props.q3 > props.q1) {
        ctx.fillRect(props.median, y0, props.q3 - props.median, height);
      } else {
        ctx.fillRect(props.median, y0, props.q1 - props.median, height);
      }
    }
    ctx.restore();

    // Draw the border around the main q1>q3 box
    if (props.q3 > props.q1) {
      ctx.strokeRect(props.q1, y0, props.q3 - props.q1, height);
    } else {
      ctx.strokeRect(props.q3, y0, props.q1 - props.q3, height);
    }

    // Draw the whiskers
    ctx.beginPath();
    ctx.moveTo(props.whiskerMin, y0);
    ctx.lineTo(props.whiskerMin, y0 + height);
    ctx.moveTo(props.whiskerMin, y);
    ctx.lineTo(props.q1, y);
    ctx.moveTo(props.whiskerMax, y0);
    ctx.lineTo(props.whiskerMax, y0 + height);
    ctx.moveTo(props.whiskerMax, y);
    ctx.lineTo(props.q3, y);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * @hidden
   */
  _getBounds(useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    const vert = this.isVertical();
    if (this.x == null) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      };
    }

    if (vert) {
      const { x, width, whiskerMax, whiskerMin } = this.getProps(
        ['x', 'width', 'whiskerMin', 'whiskerMax'],
        useFinalPosition
      );
      const x0 = x - width / 2;
      return {
        left: x0,
        top: whiskerMax,
        right: x0 + width,
        bottom: whiskerMin,
      };
    }
    const { y, height, whiskerMax, whiskerMin } = this.getProps(
      ['y', 'height', 'whiskerMin', 'whiskerMax'],
      useFinalPosition
    );
    const y0 = y - height / 2;
    return {
      left: whiskerMin,
      top: y0,
      right: whiskerMax,
      bottom: y0 + height,
    };
  }

  static id = 'boxandwhiskers';

  /**
   * @hidden
   */
  static defaults = /* #__PURE__ */ {
    ...BarElement.defaults,
    ...baseDefaults,
    medianColor: 'transparent',
    lowerBackgroundColor: 'transparent',
  };

  /**
   * @hidden
   */
  static defaultRoutes = /* #__PURE__ */ { ...BarElement.defaultRoutes, ...baseRoutes };
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    boxandwhiskers: ScriptableAndArrayOptions<IBoxAndWhiskersOptions & CommonHoverOptions, ScriptableContext<TType>>;
  }
}
