import { defaults, Element, drawPoint } from '../chart';
import { rnd } from '../data';

export const baseDefaults = {
  borderWidth: 1,

  outlierStyle: 'circle',
  outlierRadius: 2,
  outlierBackgroundColor: defaults.elements.rectangle.backgroundColor,
  outlierBorderColor: defaults.elements.rectangle.borderColor,
  outlierBorderWidth: 1,

  itemStyle: 'circle',
  itemRadius: 0,
  itemBackgroundColor: defaults.elements.rectangle.backgroundColor,
  itemBorderColor: defaults.elements.rectangle.borderColor,
  itemBorderWidth: 0,

  hitPadding: 2,
  outlierHitRadius: 4,
};

export const baseOptionKeys = Object.keys(baseDefaults);

export class StatsBase extends Element {
  isVertical() {
    return this.height == null;
  }

  _drawItems(ctx) {
    const vert = this.isVertical();
    const props = this.getProps(['x', 'y', 'items', 'width', 'height']);
    const options = this.options;

    if (options.itemRadius <= 0 || !props.items || props.items.length <= 0) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = options.itemBorderColor;
    ctx.fillStyle = options.itemBackgroundColor;
    ctx.lineWith = options.itemBorderWidth;
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

  _drawOutliers(ctx) {
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

  _getBounds(_useFinalPosition) {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }

  _getHitBounds(useFinalPosition) {
    const padding = this.options.hitPadding;
    const b = this._getBounds(useFinalPosition);
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding,
    };
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    if (Number.isNaN(this.x) && Number.isNaN(this.y)) {
      return false;
    }
    return (
      this._boxInRange(mouseX, mouseY, useFinalPosition) ||
      this._outlierIndexInRange(mouseX, mouseY, useFinalPosition) >= 0
    );
  }

  inXRange(mouseX, useFinalPosition) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }

  inYRange(mouseY, useFinalPosition) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  _outlierIndexInRange(mouseX, mouseY, useFinalPosition) {
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

  _boxInRange(mouseX, mouseY, useFinalPosition) {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  getCenterPoint(useFinalPosition) {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x: props.x,
      y: props.y,
    };
  }

  _getOutliers(useFinalPosition) {
    const props = this.getProps(['outliers'], useFinalPosition);
    return props.outliers || [];
  }

  tooltipPosition(eventPosition, tooltip) {
    if (!eventPosition) {
      // fallback
      return this.getCenterPoint();
    }
    delete tooltip._tooltipOutlier;

    const props = this.getProps(['x', 'y']);
    const index = this._outlierIndexInRange(eventPosition.x, eventPosition.y);
    if (index < 0) {
      return this.getCenterPoint();
    }
    // hack in the data of the hovered outlier
    tooltip._tooltipOutlier = {
      index,
      datasetIndex: this._datasetIndex,
    };
    if (this.isVertical()) {
      return {
        x: props.x,
        y: this._getOutliers()[index],
      };
    }
    return {
      x: this._getOutliers()[index],
      y: props.y,
    };
  }
}
