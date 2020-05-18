import { helpers, defaults } from 'chart.js';
import { StatsBase, baseDefaults } from './base';

export class Violin extends StatsBase {
  draw(ctx) {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    const props = this.getProps(['x', 'y', 'width', 'height', 'min', 'max', 'coords', 'minEstimate', 'maxEstimate']);

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
      props.coords.forEach(({ v, estimate }) => {
        ctx.lineTo(x - estimate * factor, v);
      });
      ctx.lineTo(x, props.max);
      ctx.moveTo(x, props.min);
      props.coords.forEach(({ v, estimate }) => {
        ctx.lineTo(x + estimate * factor, v);
      });
      ctx.lineTo(x, props.max);
    } else {
      const y = props.y;
      const height = props.height;
      const factor = height / 2 / props.maxEstimate;
      ctx.moveTo(props.min, y);
      props.coords.forEach(({ v, estimate }) => {
        ctx.lineTo(v, y - estimate * factor);
      });
      ctx.lineTo(props.max, y);
      ctx.moveTo(props.min, y);
      props.coords.forEach(({ v, estimate }) => {
        ctx.lineTo(v, y + estimate * factor);
      });
      ctx.lineTo(props.max, y);
    }
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
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

  // height() {
  //   const vm = this._view;
  //   return vm.base - Math.min(vm.violin.min, vm.violin.max);
  // },

  getArea() {
    const props = this.getProps(['min', 'max', 'height', 'width']);
    const iqr = Math.abs(props.max - props.min);
    if (this.isVertical()) {
      return iqr * props.width;
    }
    return iqr * props.height;
  }
}

Violin._type = 'violin';
Violin.register = () => {
  defaults.set('elements', {
    [Violin._type]: Object.assign({}, baseDefaults, {
      points: 100,
    }),
  });
  return Violin;
};
