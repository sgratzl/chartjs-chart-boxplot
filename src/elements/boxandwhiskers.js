import { defaults } from 'chart.js';
import { ArrayElementBase, baseDefaults, baseOptionKeys } from './base';

export const boxOptionsKeys = baseOptionKeys.concat(['medianColor', 'lowerColor']);

export class BoxAndWiskers extends ArrayElementBase {
  draw(ctx) {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;

    this._drawBoxPlot(ctx);
    this._drawOutliers(ctx);

    ctx.restore();

    this._drawItems(ctx);
  }

  _drawBoxPlot(ctx) {
    if (this.isVertical()) {
      this._drawBoxPlotVertical(ctx);
    } else {
      this._drawBoxPlotHorizontal(ctx);
    }
  }

  _drawBoxPlotVertical(ctx) {
    const options = this.options;
    const props = this.getProps(['x', 'width', 'q1', 'q3', 'median', 'whiskerMin', 'whiskerMax']);

    const x = props.x;
    const width = props.width;
    const x0 = x - width / 2;
    // Draw the q1>q3 box
    if (props.q3 > props.q1) {
      ctx.fillRect(x0, props.q1, width, props.q3 - props.q1);
    } else {
      ctx.fillRect(x0, props.q3, width, props.q1 - props.q3);
    }

    // Draw the median line
    ctx.save();
    if (options.medianColor && options.medianColor !== 'none') {
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
    if (options.lowerColor && options.lowerColor !== 'none') {
      ctx.fillStyle = options.lowerColor;
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

  _drawBoxPlotHorizontal(ctx) {
    const options = this.options;
    const props = this.getProps(['y', 'height', 'q1', 'q3', 'median', 'whiskerMin', 'whiskerMax']);

    const y = props.y;
    const height = props.height;
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
    if (options.lowerColor && options.lowerColor !== 'transparent') {
      ctx.fillStyle = options.lowerColor;
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

  _getBounds(useFinalPosition) {
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

  // height(useFinalPosition) {
  //   const props = this.getProps(['base', 'q1', 'q3'], useFinalPosition);
  //   return props.base - Math.min(props.q1, props.q3);
  // }

  getArea(useFinalPosition) {
    const props = this.getProps(['q3', 'q1', 'width', 'height'], useFinalPosition);
    const iqr = Math.abs(props.q3 - props.q1);
    if (this.isVertical()) {
      return iqr * props.width;
    }
    return iqr * props.height;
  }
}

BoxAndWiskers._type = 'boxAndWhiskers';
BoxAndWiskers.register = () => {
  defaults.set('elements', {
    [BoxAndWiskers._type]: Object.assign({}, baseDefaults, {
      medianColor: 'transparent',
      lowerColor: 'transparent',
    }),
  });
  return BoxAndWiskers;
};
