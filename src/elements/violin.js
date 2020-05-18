import { helpers, defaults } from 'chart.js';
import { StatsBase, baseDefaults } from './base';

export class ViolinElement extends StatsBase {
  draw(ctx) {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    const props = this.getProps(['x', 'y', 'width', 'height', 'min', 'max', 'coords', 'maxEstimate']);

    helpers.canvas.drawPoint(
      ctx,
      {
        pointStyle: 'rectRot',
        radius: 5,
        borderWidth: this.options.borderWidth,
      },
      props.x,
      props.y
    );

    if (props.coords && props.coords.length > 0) {
      this._drawCoords(ctx, props);
    }
    this._drawOutliers(ctx);

    ctx.restore();

    this._drawItems(ctx);
  }

  _drawCoords(ctx, props) {
    ctx.beginPath();
    if (this.isVertical()) {
      const x = props.x;
      const width = props.width;
      const factor = width / 2 / props.maxEstimate;
      ctx.moveTo(x, props.min);
      props.coords.forEach((c) => {
        ctx.lineTo(x - c.estimate * factor, c.v);
      });
      ctx.lineTo(x, props.max);
      ctx.moveTo(x, props.min);
      props.coords.forEach((c) => {
        ctx.lineTo(x + c.estimate * factor, c.v);
      });
      ctx.lineTo(x, props.max);
    } else {
      const y = props.y;
      const height = props.height;
      const factor = height / 2 / props.maxEstimate;
      ctx.moveTo(props.min, y);
      props.coords.forEach((c) => {
        ctx.lineTo(c.v, y - c.estimate * factor);
      });
      ctx.lineTo(props.max, y);
      ctx.moveTo(props.min, y);
      props.coords.forEach((c) => {
        ctx.lineTo(c.v, y + c.estimate * factor);
      });
      ctx.lineTo(props.max, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  _getBounds(useFinalPosition) {
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

  getArea() {
    const props = this.getProps(['min', 'max', 'height', 'width']);
    const iqr = Math.abs(props.max - props.min);
    if (this.isVertical()) {
      return iqr * props.width;
    }
    return iqr * props.height;
  }
}

ViolinElement._type = 'violin';
ViolinElement.register = () => {
  defaults.set('elements', {
    [ViolinElement._type]: baseDefaults,
  });
  return ViolinElement;
};
