'use strict';

import * as Chart from 'chart.js';
import ArrayElementBase, {
  defaults
} from './base';


Chart.defaults.global.elements.violin = {
  points: 100,
  ...defaults
};

function transitionViolin(start, view, model, ease) {
  const keys = Object.keys(model);
  for (const key of keys) {
    const target = model[key];
    const origin = start[key];
    if (origin === target) {
      continue;
    }
    if (typeof target === 'number') {
      view[key] = origin + (target - origin) * ease;
      continue;
    }
    if (key === 'coords') {
      const v = view[key];
      const common = Math.min(target.length, origin.length);
      for (let i = 0; i < common; ++i) {
        v[i].v = origin[i].v + (target[i].v - origin[i].v) * ease;
        v[i].estimate = origin[i].estimate + (target[i].estimate - origin[i].estimate) * ease;
      }
    }
  }
}

const Violin = Chart.elements.Violin = ArrayElementBase.extend({
  transition(ease) {
    const r = Chart.Element.prototype.transition.call(this, ease);
    const model = this._model;
    const start = this._start;
    const view = this._view;

    // No animation -> No Transition
    if (!model || ease === 1) {
      return r;
    }
    if (start.violin == null) {
      return r; // model === view -> not copied
    }

    // create deep copy to avoid alternation
    if (model.violin === view.violin) {
      view.violin = Chart.helpers.clone(view.violin);
    }
    transitionViolin(start.violin, view.violin, model.violin, ease);

    return r;
  },
  draw() {
    const ctx = this._chart.ctx;
    const vm = this._view;

    const violin = vm.violin;
    const vert = this.isVertical();

    ctx.save();

    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = vm.borderWidth;

    const coords = violin.coords;

    Chart.canvasHelpers.drawPoint(ctx, 'rectRot', 5, vm.x, vm.y);
    ctx.stroke();

    ctx.beginPath();
    if (vert) {
      const x = vm.x;
      const width = vm.width;
      const factor = (width / 2) / violin.maxEstimate;
      ctx.moveTo(x, violin.min);
      coords.forEach(({
        v,
        estimate
      }) => {
        ctx.lineTo(x - estimate * factor, v);
      });
      ctx.lineTo(x, violin.max);
      ctx.moveTo(x, violin.min);
      coords.forEach(({
        v,
        estimate
      }) => {
        ctx.lineTo(x + estimate * factor, v);
      });
      ctx.lineTo(x, violin.max);
    } else {
      const y = vm.y;
      const height = vm.height;
      const factor = (height / 2) / violin.maxEstimate;
      ctx.moveTo(violin.min, y);
      coords.forEach(({
        v,
        estimate
      }) => {
        ctx.lineTo(v, y - estimate * factor);
      });
      ctx.lineTo(violin.max, y);
      ctx.moveTo(violin.min, y);
      coords.forEach(({
        v,
        estimate
      }) => {
        ctx.lineTo(v, y + estimate * factor);
      });
      ctx.lineTo(violin.max, y);
    }
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    this._drawOutliers(vm, violin, ctx, vert);

    ctx.restore();

    this._drawItems(vm, violin, ctx, vert);

  },
  _getBounds() {
    const vm = this._view;

    const vert = this.isVertical();
    const violin = vm.violin;

    if (vert) {
      const {
        x,
        width
      } = vm;
      const x0 = x - width / 2;
      return {
        left: x0,
        top: violin.max,
        right: x0 + width,
        bottom: violin.min
      };
    }
    const {
      y,
      height
    } = vm;
    const y0 = y - height / 2;
    return {
      left: violin.min,
      top: y0,
      right: violin.max,
      bottom: y0 + height
    };
  },
  height() {
    const vm = this._view;
    return vm.base - Math.min(vm.violin.min, vm.violin.max);
  },
  getArea() {
    const vm = this._view;
    const iqr = Math.abs(vm.violin.max - vm.violin.min);
    if (this.isVertical()) {
      return iqr * vm.width;
    }
    return iqr * vm.height;
  },
  _getOutliers() {
    return this._view.violin.outliers || [];
  },
});

export default Violin;
