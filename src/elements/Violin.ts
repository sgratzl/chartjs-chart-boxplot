import {
  BarElement,
  type ChartType,
  type CommonHoverOptions,
  type ScriptableAndArrayOptions,
  type ScriptableContext,
} from 'chart.js';
import { drawPoint } from 'chart.js/helpers';
import type { IKDEPoint } from '../data';
import { StatsBase, baseDefaults, baseRoutes, type IStatsBaseOptions, type IStatsBaseProps } from './base';

export type IViolinElementOptions = IStatsBaseOptions;

export interface IViolinElementProps extends IStatsBaseProps {
  min: number;
  max: number;
  median: number;
  coords: IKDEPoint[];
  maxEstimate?: number;
}

export class Violin extends StatsBase<IViolinElementProps, IViolinElementOptions> {
  /**
   * @hidden
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    const props = this.getProps(['x', 'y', 'median', 'width', 'height', 'min', 'max', 'coords', 'maxEstimate']);

    if (props.median != null) {
      // draw median dot
      drawPoint(
        ctx,
        {
          pointStyle: 'rectRot',
          radius: 5,
          borderWidth: this.options.borderWidth,
        },
        props.x,
        props.y
      );
    }

    if (props.coords && props.coords.length > 0) {
      this._drawCoords(ctx, props);
    }
    this._drawOutliers(ctx);
    this._drawMeanDot(ctx);

    ctx.restore();

    this._drawItems(ctx);
  }

  /**
   * @hidden
   */
  protected _drawCoords(
    ctx: CanvasRenderingContext2D,
    props: Pick<IViolinElementProps, 'x' | 'coords' | 'y' | 'maxEstimate' | 'width' | 'height' | 'min' | 'max'>
  ): void {
    let maxEstimate: number;
    if (props.maxEstimate == null) {
      maxEstimate = props.coords.reduce((a, d) => Math.max(a, d.estimate), Number.NEGATIVE_INFINITY);
    } else {
      maxEstimate = props.maxEstimate;
    }

    ctx.beginPath();
    if (this.isVertical()) {
      const { x, width } = props;
      const factor = width / 2 / maxEstimate;

      props.coords.forEach((c) => {
        ctx.lineTo(x - c.estimate * factor, c.v);
      });

      props.coords
        .slice()
        .reverse()
        .forEach((c) => {
          ctx.lineTo(x + c.estimate * factor, c.v);
        });
    } else {
      const { y, height } = props;
      const factor = height / 2 / maxEstimate;

      props.coords.forEach((c) => {
        ctx.lineTo(c.v, y - c.estimate * factor);
      });

      props.coords
        .slice()
        .reverse()
        .forEach((c) => {
          ctx.lineTo(c.v, y + c.estimate * factor);
        });
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  /**
   * @hidden
   */
  _getBounds(useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    if (this.isVertical()) {
      const { x, width, min, max } = this.getProps(['x', 'width', 'min', 'max'], useFinalPosition);
      const x0 = x - width / 2;
      return {
        left: x0,
        top: max,
        right: x0 + width,
        bottom: min,
      };
    }
    const { y, height, min, max } = this.getProps(['y', 'height', 'min', 'max'], useFinalPosition);
    const y0 = y - height / 2;
    return {
      left: min,
      top: y0,
      right: max,
      bottom: y0 + height,
    };
  }

  static id = 'violin';

  /**
   * @hidden
   */
  static defaults = /* #__PURE__ */ { ...BarElement.defaults, ...baseDefaults };

  /**
   * @hidden
   */
  static defaultRoutes = /* #__PURE__ */ { ...BarElement.defaultRoutes, ...baseRoutes };
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    violin: ScriptableAndArrayOptions<IViolinElementOptions & CommonHoverOptions, ScriptableContext<TType>>;
  }
}
