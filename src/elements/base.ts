import { Element } from 'chart.js';
import { drawPoint } from 'chart.js/helpers';
import { rnd } from '../data';
import { ExtendedTooltip } from '../tooltip';

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
}

export const baseDefaults = {
  borderWidth: 1,

  outlierStyle: 'circle',
  outlierRadius: 2,
  outlierBorderWidth: 1,

  itemStyle: 'circle',
  itemRadius: 0,
  itemBorderWidth: 0,

  hitPadding: 2,
  outlierHitRadius: 4,
};

export const baseRoutes = {
  outlierBackgroundColor: 'color',
  outlierBorderColor: 'color',
  itemBackgroundColor: 'color',
  itemBorderColor: 'color',
};

export const baseOptionKeys = /*#__PURE__*/ (() => Object.keys(baseDefaults).concat(Object.keys(baseRoutes)))();

export interface IStatsBaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  items: number[];
  outliers: number[];
}

export class StatsBase<T extends IStatsBaseProps, O extends IStatsBaseOptions> extends Element<T, O> {
  declare _datasetIndex: number;
  declare _index: number;

  isVertical() {
    return this.getProps(['height']).height == null;
  }

  _drawItems(ctx: CanvasRenderingContext2D) {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'items', 'width', 'height']);
    const options = this.options;

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

    if (vert) {
      props.items.forEach((v) => {
        drawPoint(ctx, pointOptions, props.x - props.width / 2 + random() * props.width, v);
      });
    } else {
      props.items.forEach((v) => {
        drawPoint(ctx, pointOptions, v, props.y - props.height / 2 + random() * props.height);
      });
    }
    ctx.restore();
  }

  _drawOutliers(ctx: CanvasRenderingContext2D) {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'outliers']);
    const options = this.options;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getBounds(_useFinalPosition?: boolean) {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }

  _getHitBounds(useFinalPosition?: boolean) {
    const padding = this.options.hitPadding;
    const b = this._getBounds(useFinalPosition);
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding,
    };
  }

  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean) {
    if (Number.isNaN(this.x) && Number.isNaN(this.y)) {
      return false;
    }
    return (
      this._boxInRange(mouseX, mouseY, useFinalPosition) ||
      this._outlierIndexInRange(mouseX, mouseY, useFinalPosition) >= 0
    );
  }

  inXRange(mouseX: number, useFinalPosition?: boolean) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }

  inYRange(mouseY: number, useFinalPosition?: boolean) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  _outlierIndexInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean) {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    const hitRadius = this.options.outlierHitRadius;
    const outliers = this._getOutliers(useFinalPosition);
    const vertical = this.isVertical();

    // check if along the outlier line
    if ((vertical && Math.abs(mouseX - props.x) > hitRadius) || (!vertical && Math.abs(mouseY - props.y) > hitRadius)) {
      return -1;
    }
    const toCompare = vertical ? mouseY : mouseX;
    for (let i = 0; i < outliers.length; i++) {
      if (Math.abs(outliers[i] - toCompare) <= hitRadius) {
        return i;
      }
    }
    return -1;
  }

  _boxInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  getCenterPoint(useFinalPosition?: boolean) {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x: props.x,
      y: props.y,
    };
  }

  _getOutliers(useFinalPosition?: boolean) {
    const props = this.getProps(['outliers'], useFinalPosition);
    return props.outliers || [];
  }

  tooltipPosition(eventPosition?: { x: number; y: number } | boolean, tooltip?: ExtendedTooltip) {
    if (!eventPosition || typeof eventPosition === 'boolean') {
      // fallback
      return this.getCenterPoint();
    }
    if (tooltip) {
      delete tooltip._tooltipOutlier;
    }

    const props = this.getProps(['x', 'y']);
    const index = this._outlierIndexInRange(eventPosition.x, eventPosition.y);
    if (index < 0 || !tooltip) {
      return this.getCenterPoint();
    }
    // hack in the data of the hovered outlier
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
