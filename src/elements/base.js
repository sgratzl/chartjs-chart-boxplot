import { defaults, Element } from 'chart.js';
import { rnd } from '../data';

export const baseDefaults = Object.assign({}, defaults.elements.rectangle, {
  borderWidth: 1,
  outlierRadius: 2,
  outlierColor: defaults.elements.rectangle.backgroundColor,
  lowerColor: defaults.elements.rectangle.lowerColor,
  medianColor: null,
  itemRadius: 0,
  itemStyle: 'circle',
  itemBackgroundColor: defaults.elements.rectangle.backgroundColor,
  itemBorderColor: defaults.elements.rectangle.borderColor,
  hitPadding: 2,
  outlierHitRadius: 4,
  tooltipDecimals: 2,
});

export class ArrayElementBase extends Element {
  isVertical() {
    return this._view.width !== undefined;
  }
  _drawItems(props, container, ctx, vert) {
    const options = this.options;

    if (options.itemRadius <= 0 || !container.items || container.items.length <= 0) {
      return;
    }
    ctx.save();
    ctx.strokeStyle = options.itemBorderColor;
    ctx.fillStyle = options.itemBackgroundColor;
    // jitter based on random data
    // use the dataset index and index to initialize the random number generator
    // TODO
    const random = rnd(this._datasetIndex * 1000 + this._index);

    if (vert) {
      container.items.forEach((v) => {
        // TODO
        Chart.canvasHelpers.drawPoint(
          ctx,
          options.itemStyle,
          options.itemRadius,
          props.x - props.width / 2 + random() * props.width,
          v
        );
      });
    } else {
      container.items.forEach((v) => {
        Chart.canvasHelpers.drawPoint(
          ctx,
          options.itemStyle,
          options.itemRadius,
          v,
          props.y - props.height / 2 + random() * props.height
        );
      });
    }
    ctx.restore();
  }
  _drawOutliers(props, container, ctx, vert) {
    const options = this.options;
    if (options.outlierRadius <= 0 || !container.outliers || container.outliers.length === 0) {
      return;
    }
    ctx.fillStyle = options.outlierColor;
    ctx.beginPath();
    if (vert) {
      container.outliers.forEach((v) => {
        ctx.arc(props.x, v, options.outlierRadius, 0, Math.PI * 2);
      });
    } else {
      container.outliers.forEach((v) => {
        ctx.arc(v, props.y, options.outlierRadius, 0, Math.PI * 2);
      });
    }
    ctx.fill();
    ctx.closePath();
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
  height() {
    return 0; // abstract
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    if (this.x == null) {
      return false;
    }
    return (
      this._boxInRange(mouseX, mouseY, useFinalPosition) ||
      this._outlierIndexInRange(mouseX, mouseY, useFinalPosition) >= 0
    );
  }
  inLabelRange(mouseX, mouseY, useFinalPosition) {
    if (this.x == null) {
      return false;
    }
    const bounds = this._getHitBounds(useFinalPosition);
    if (this.isVertical()) {
      return mouseX >= bounds.left && mouseX <= bounds.right;
    }
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
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
  getArea() {
    return 0; // abstract
  }
  _getOutliers(_useFinalPosition) {
    return []; // abstract
  }
  tooltipPosition(eventPosition, tooltip, useFinalPosition) {
    if (!eventPosition) {
      // fallback
      return this.getCenterPoint(useFinalPosition);
    }
    delete tooltip._tooltipOutlier;

    const props = this.getProps(['x', 'y'], useFinalPosition);
    const index = this._outlierIndexInRange(eventPosition.x, eventPosition.y);
    if (index < 0) {
      return this.getCenterPoint(useFinalPosition);
    }
    tooltip._tooltipOutlier = index;
    if (this.isVertical()) {
      return {
        x: props.x,
        y: this._getOutliers(useFinalPosition)[index],
      };
    }
    return {
      x: this._getOutliers(useFinalPosition)[index],
      y: props.y,
    };
  }
}
