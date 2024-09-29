import { Element } from 'chart.js';
import { drawPoint } from 'chart.js/helpers';
import { rnd } from '../data';
import type { ExtendedTooltip } from '../tooltip';

export interface IStatsBaseOptions {
  /**
   * @default see rectangle
   * scriptable
   * indexable
   */
  backgroundColor: string;

  /**
   * @default see rectangle
   * scriptable
   * indexable
   */
  borderColor: string;

  /**
   * @default 1
   * scriptable
   * indexable
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
   * scriptable
   * indexable
   */
  outlierRadius: number;

  /**
   * @default see rectangle.backgroundColor
   * scriptable
   * indexable
   */
  outlierBackgroundColor: string;

  /**
   * @default see rectangle.borderColor
   * scriptable
   * indexable
   */
  outlierBorderColor: string;
  /**
   * @default 1
   * scriptable
   * indexable
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
   * scriptable
   * indexable
   */
  itemRadius: number;

  /**
   * background color for items
   * @default see rectangle.backgroundColor
   * scriptable
   * indexable
   */
  itemBackgroundColor: string;

  /**
   * border color for items
   * @default see rectangle.borderColor
   * scriptable
   * indexable
   */
  itemBorderColor: string;

  /**
   * border width for items
   * @default 0
   * scriptable
   * indexable
   */
  itemBorderWidth: number;
  /**
   * hit radius for hit test of items
   * @default 0
   * scriptable
   * indexable
   */
  itemHitRadius: number;

  /**
   * padding that is added around the bounding box when computing a mouse hit
   * @default 2
   * scriptable
   * indexable
   */
  hitPadding: number;

  /**
   * hit radius for hit test of outliers
   * @default 4
   * scriptable
   * indexable
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
   * scriptable
   * indexable
   */
  meanRadius: number;

  /**
   * background color for mean dot
   * @default see rectangle.backgroundColor
   * scriptable
   * indexable
   */
  meanBackgroundColor: string;

  /**
   * border color for mean dot
   * @default see rectangle.borderColor
   * scriptable
   * indexable
   */
  meanBorderColor: string;

  /**
   * border width for mean dot
   * @default 0
   * scriptable
   * indexable
   */
  meanBorderWidth: number;
}

/**
 * @hidden
 */
export const baseDefaults = {
  borderWidth: 1,

  outlierStyle: 'circle',
  outlierRadius: 2,
  outlierBorderWidth: 1,

  itemStyle: 'circle',
  itemRadius: 0,
  itemBorderWidth: 0,
  itemHitRadius: 0,

  meanStyle: 'circle',
  meanRadius: 3,
  meanBorderWidth: 1,

  hitPadding: 2,
  outlierHitRadius: 4,
};

/**
 * @hidden
 */
export const baseRoutes = {
  outlierBackgroundColor: 'backgroundColor',
  outlierBorderColor: 'borderColor',
  itemBackgroundColor: 'backgroundColor',
  itemBorderColor: 'borderColor',
  meanBackgroundColor: 'backgroundColor',
  meanBorderColor: 'borderColor',
};

/**
 * @hidden
 */
export const baseOptionKeys = /* #__PURE__ */ (() => Object.keys(baseDefaults).concat(Object.keys(baseRoutes)))();

export interface IStatsBaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  items: number[];
  outliers: number[];
}

export class StatsBase<T extends IStatsBaseProps & { mean?: number }, O extends IStatsBaseOptions> extends Element<
  T,
  O
> {
  /**
   * @hidden
   */
  declare _datasetIndex: number;

  /**
   * @hidden
   */
  declare horizontal: boolean;

  /**
   * @hidden
   */
  declare _index: number;

  /**
   * @hidden
   */
  isVertical(): boolean {
    return !this.horizontal;
  }

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getBounds(_useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    if (Number.isNaN(this.x) && Number.isNaN(this.y)) {
      return false;
    }
    return (
      this._boxInRange(mouseX, mouseY, useFinalPosition) ||
      this._outlierIndexInRange(mouseX, mouseY, useFinalPosition) != null ||
      this._itemIndexInRange(mouseX, mouseY, useFinalPosition) != null
    );
  }

  /**
   * @hidden
   */
  inXRange(mouseX: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }

  /**
   * @hidden
   */
  inYRange(mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  /**
   * @hidden
   */
  protected _outlierIndexInRange(
    mouseX: number,
    mouseY: number,
    useFinalPosition?: boolean
  ): { index: number; x: number; y: number } | null {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    const hitRadius = this.options.outlierHitRadius;
    const outliers = this._getOutliers(useFinalPosition);
    const vertical = this.isVertical();

    // check if along the outlier line
    if ((vertical && Math.abs(mouseX - props.x) > hitRadius) || (!vertical && Math.abs(mouseY - props.y) > hitRadius)) {
      return null;
    }
    const toCompare = vertical ? mouseY : mouseX;
    for (let i = 0; i < outliers.length; i += 1) {
      if (Math.abs(outliers[i] - toCompare) <= hitRadius) {
        return vertical ? { index: i, x: props.x, y: outliers[i] } : { index: i, x: outliers[i], y: props.y };
      }
    }
    return null;
  }

  /**
   * @hidden
   */
  protected _itemIndexInRange(
    mouseX: number,
    mouseY: number,
    useFinalPosition?: boolean
  ): { index: number; x: number; y: number } | null {
    const hitRadius = this.options.itemHitRadius;
    if (hitRadius <= 0) {
      return null;
    }
    const props = this.getProps(['x', 'y', 'items', 'width', 'height', 'outliers'], useFinalPosition);
    const vert = this.isVertical();
    const { options } = this;

    if (options.itemRadius <= 0 || !props.items || props.items.length <= 0) {
      return null;
    }
    // jitter based on random data
    // use the dataset index and index to initialize the random number generator
    const random = rnd(this._datasetIndex * 1000 + this._index);
    const outliers = new Set(props.outliers || []);

    if (vert) {
      for (let i = 0; i < props.items.length; i++) {
        const y = props.items[i];
        if (!outliers.has(y)) {
          const x = props.x - props.width / 2 + random() * props.width;
          if (Math.abs(x - mouseX) <= hitRadius && Math.abs(y - mouseY) <= hitRadius) {
            return { index: i, x, y };
          }
        }
      }
    } else {
      for (let i = 0; i < props.items.length; i++) {
        const x = props.items[i];
        if (!outliers.has(x)) {
          const y = props.y - props.height / 2 + random() * props.height;
          if (Math.abs(x - mouseX) <= hitRadius && Math.abs(y - mouseY) <= hitRadius) {
            return { index: i, x, y };
          }
        }
      }
    }
    return null;
  }

  /**
   * @hidden
   */
  protected _boxInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  /**
   * @hidden
   */
  getCenterPoint(useFinalPosition?: boolean): { x: number; y: number } {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x: props.x,
      y: props.y,
    };
  }

  /**
   * @hidden
   */
  protected _getOutliers(useFinalPosition?: boolean): number[] {
    const props = this.getProps(['outliers'], useFinalPosition);
    return props.outliers || [];
  }

  /**
   * @hidden
   */
  tooltipPosition(
    eventPosition?: { x: number; y: number } | boolean,
    tooltip?: ExtendedTooltip
  ): { x: number; y: number } {
    if (!eventPosition || typeof eventPosition === 'boolean') {
      // fallback
      return this.getCenterPoint();
    }
    if (tooltip) {
      delete tooltip._tooltipOutlier;

      delete tooltip._tooltipItem;
    }

    //outlier
    const info = this._outlierIndexInRange(eventPosition.x, eventPosition.y);
    if (info != null && tooltip) {
      // hack in the data of the hovered outlier

      tooltip._tooltipOutlier = {
        index: info.index,
        datasetIndex: this._datasetIndex,
      };
      return {
        x: info.x,
        y: info.y,
      };
    }
    // items
    const itemInfo = this._itemIndexInRange(eventPosition.x, eventPosition.y);
    if (itemInfo != null && tooltip) {
      // hack in the data of the hovered outlier

      tooltip._tooltipItem = {
        index: itemInfo.index,
        datasetIndex: this._datasetIndex,
      };
      return {
        x: itemInfo.x,
        y: itemInfo.y,
      };
    }

    // fallback
    return this.getCenterPoint();
  }
}
