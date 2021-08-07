import { Element } from 'chart.js';
import { drawPoint } from 'chart.js/helpers';
import { rnd } from '../data';
import type { ExtendedTooltip } from '../tooltip';

export interface IStatsBaseOptions {
  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  backgroundColor: string;

  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  borderColor: string;

  /**
   * @default 1
   * @scriptable
   * @indexable
   */
  borderWidth: number;

  /**
   * item style used to render outliers
   * @default circle
   */
  outlierStyle:
    | 'circle'
    | 'triangle'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'cross'
    | 'crossRot'
    | 'star'
    | 'line'
    | 'dash';

  /**
   * radius used to render outliers
   * @default 2
   * @scriptable
   * @indexable
   */
  outlierRadius: number;

  /**
   * @default see rectangle.backgroundColor
   * @scriptable
   * @indexable
   */
  outlierBackgroundColor: string;

  /**
   * @default see rectangle.borderColor
   * @scriptable
   * @indexable
   */
  outlierBorderColor: string;
  /**
   * @default 1
   * @scriptable
   * @indexable
   */
  outlierBorderWidth: number;

  /**
   * item style used to render items
   * @default circle
   */
  itemStyle:
    | 'circle'
    | 'triangle'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'cross'
    | 'crossRot'
    | 'star'
    | 'line'
    | 'dash';

  /**
   * radius used to render items
   * @default 0 so disabled
   * @scriptable
   * @indexable
   */
  itemRadius: number;

  /**
   * background color for items
   * @default see rectangle.backgroundColor
   * @scriptable
   * @indexable
   */
  itemBackgroundColor: string;

  /**
   * border color for items
   * @default see rectangle.borderColor
   * @scriptable
   * @indexable
   */
  itemBorderColor: string;

  /**
   * border width for items
   * @default 0
   * @scriptable
   * @indexable
   */
  itemBorderWidth: number;

  /**
   * padding that is added around the bounding box when computing a mouse hit
   * @default 2
   * @scriptable
   * @indexable
   */
  hitPadding: number;

  /**
   * hit radius for hit test of outliers
   * @default 4
   * @scriptable
   * @indexable
   */
  outlierHitRadius: number;

  /**
   * item style used to render mean dot
   * @default circle
   */
  meanStyle:
    | 'circle'
    | 'triangle'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'cross'
    | 'crossRot'
    | 'star'
    | 'line'
    | 'dash';

  /**
   * radius used to mean dots
   * @default 3
   * @scriptable
   * @indexable
   */
  meanRadius: number;

  /**
   * background color for mean dot
   * @default see rectangle.backgroundColor
   * @scriptable
   * @indexable
   */
  meanBackgroundColor: string;

  /**
   * border color for mean dot
   * @default see rectangle.borderColor
   * @scriptable
   * @indexable
   */
  meanBorderColor: string;

  /**
   * border width for mean dot
   * @default 0
   * @scriptable
   * @indexable
   */
  meanBorderWidth: number;
}

export const baseDefaults = {
  borderWidth: 1,

  outlierStyle: 'circle',
  outlierRadius: 2,
  outlierBorderWidth: 1,

  itemStyle: 'circle',
  itemRadius: 0,
  itemBorderWidth: 0,

  meanStyle: 'circle',
  meanRadius: 3,
  meanBorderWidth: 1,

  hitPadding: 2,
  outlierHitRadius: 4,
};

export const baseRoutes = {
  outlierBackgroundColor: 'backgroundColor',
  outlierBorderColor: 'borderColor',
  itemBackgroundColor: 'backgroundColor',
  itemBorderColor: 'borderColor',
  meanBackgroundColor: 'backgroundColor',
  meanBorderColor: 'borderColor',
};

export const baseOptionKeys = /* #__PURE__ */ (() => Object.keys(baseDefaults).concat(Object.keys(baseRoutes)))();

export interface IStatsBaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  items: number[];
  outliers: number[];
  mean: number;
}

export class StatsBase<T extends IStatsBaseProps, O extends IStatsBaseOptions> extends Element<T, O> {
  declare _datasetIndex: number;

  declare horizontal: boolean;

  declare _index: number;

  isVertical(): boolean {
    return !this.horizontal;
  }

  protected _drawItems(ctx: CanvasRenderingContext2D): void {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'items', 'width', 'height', 'outliers']);
    const { options } = this;

    if (options.itemRadius <= 0 || !props.items || props.items.length <= 0) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = options.itemBorderColor;
    ctx.fillStyle = options.itemBackgroundColor;
    ctx.lineWidth = options.itemBorderWidth;
    // jitter based on random data
    // use the dataset index and index to initialize the random number generator
    const random = rnd(this._datasetIndex * 1000 + this._index);

    const pointOptions = {
      pointStyle: options.itemStyle,
      radius: options.itemRadius,
      borderWidth: options.itemBorderWidth,
    };
    const outliers = new Set(props.outliers || []);

    if (vert) {
      props.items.forEach((v) => {
        if (!outliers.has(v)) {
          drawPoint(ctx, pointOptions, props.x - props.width / 2 + random() * props.width, v);
        }
      });
    } else {
      props.items.forEach((v) => {
        if (!outliers.has(v)) {
          drawPoint(ctx, pointOptions, v, props.y - props.height / 2 + random() * props.height);
        }
      });
    }
    ctx.restore();
  }

  protected _drawOutliers(ctx: CanvasRenderingContext2D): void {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'outliers']);
    const { options } = this;
    if (options.outlierRadius <= 0 || !props.outliers || props.outliers.length === 0) {
      return;
    }
    ctx.save();
    ctx.fillStyle = options.outlierBackgroundColor;
    ctx.strokeStyle = options.outlierBorderColor;
    ctx.lineWidth = options.outlierBorderWidth;

    const pointOptions = {
      pointStyle: options.outlierStyle,
      radius: options.outlierRadius,
      borderWidth: options.outlierBorderWidth,
    };

    if (vert) {
      props.outliers.forEach((v) => {
        drawPoint(ctx, pointOptions, props.x, v);
      });
    } else {
      props.outliers.forEach((v) => {
        drawPoint(ctx, pointOptions, v, props.y);
      });
    }

    ctx.restore();
  }

  protected _drawMeanDot(ctx: CanvasRenderingContext2D): void {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'mean']);
    const { options } = this;
    if (options.meanRadius <= 0 || props.mean == null || Number.isNaN(props.mean)) {
      return;
    }
    ctx.save();
    ctx.fillStyle = options.meanBackgroundColor;
    ctx.strokeStyle = options.meanBorderColor;
    ctx.lineWidth = options.meanBorderWidth;

    const pointOptions = {
      pointStyle: options.meanStyle,
      radius: options.meanRadius,
      borderWidth: options.meanBorderWidth,
    };

    if (vert) {
      drawPoint(ctx, pointOptions, props.x, props.mean);
    } else {
      drawPoint(ctx, pointOptions, props.mean, props.y);
    }

    ctx.restore();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  _getBounds(_useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }

  _getHitBounds(useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    const padding = this.options.hitPadding;
    const b = this._getBounds(useFinalPosition);
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding,
    };
  }

  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    if (Number.isNaN(this.x) && Number.isNaN(this.y)) {
      return false;
    }
    return (
      this._boxInRange(mouseX, mouseY, useFinalPosition) ||
      this._outlierIndexInRange(mouseX, mouseY, useFinalPosition) >= 0
    );
  }

  inXRange(mouseX: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }

  inYRange(mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  protected _outlierIndexInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): number {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    const hitRadius = this.options.outlierHitRadius;
    const outliers = this._getOutliers(useFinalPosition);
    const vertical = this.isVertical();

    // check if along the outlier line
    if ((vertical && Math.abs(mouseX - props.x) > hitRadius) || (!vertical && Math.abs(mouseY - props.y) > hitRadius)) {
      return -1;
    }
    const toCompare = vertical ? mouseY : mouseX;
    for (let i = 0; i < outliers.length; i += 1) {
      if (Math.abs(outliers[i] - toCompare) <= hitRadius) {
        return i;
      }
    }
    return -1;
  }

  protected _boxInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  getCenterPoint(useFinalPosition?: boolean): { x: number; y: number } {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x: props.x,
      y: props.y,
    };
  }

  protected _getOutliers(useFinalPosition?: boolean): number[] {
    const props = this.getProps(['outliers'], useFinalPosition);
    return props.outliers || [];
  }

  tooltipPosition(
    eventPosition?: { x: number; y: number } | boolean,
    tooltip?: ExtendedTooltip
  ): { x: number; y: number } {
    if (!eventPosition || typeof eventPosition === 'boolean') {
      // fallback
      return this.getCenterPoint();
    }
    if (tooltip) {
      // eslint-disable-next-line no-param-reassign
      delete tooltip._tooltipOutlier;
    }

    const props = this.getProps(['x', 'y']);
    const index = this._outlierIndexInRange(eventPosition.x, eventPosition.y);
    if (index < 0 || !tooltip) {
      return this.getCenterPoint();
    }
    // hack in the data of the hovered outlier
    // eslint-disable-next-line no-param-reassign
    tooltip._tooltipOutlier = {
      index,
      datasetIndex: this._datasetIndex,
    };
    if (this.isVertical()) {
      return {
        x: props.x as number,
        y: this._getOutliers()[index],
      };
    }
    return {
      x: this._getOutliers()[index],
      y: props.y as number,
    };
  }
}
