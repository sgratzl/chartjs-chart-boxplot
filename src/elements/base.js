'use strict';

import * as Chart from 'chart.js';
import {rnd} from '../data';

export const defaults = {
  ...Chart.defaults.global.elements.rectangle,
  borderWidth: 1,
  outlierRadius: 2,
  outlierColor: Chart.defaults.global.elements.rectangle.backgroundColor,
  medianColor: null,
  itemRadius: 0,
  itemStyle: 'circle',
  itemBackgroundColor: Chart.defaults.global.elements.rectangle.backgroundColor,
  itemBorderColor: Chart.defaults.global.elements.rectangle.borderColor,
  hitPadding: 2
};

const ArrayElementBase = Chart.Element.extend({
  isVertical() {
    return this._view.width !== undefined;
  },
  draw() {
    // abstract
  },
  _drawItems(vm, container, ctx, vert) {
    if (vm.itemRadius <= 0 || !container.items || container.items.length <= 0) {
      return;
    }
    ctx.save();
    ctx.strokeStle = vm.itemBorderColor;
    ctx.fillStyle = vm.itemBackgroundColor;
    // jitter based on random data
    // use the datesetindex and index to initialize the random number generator
    const random = rnd(this._datasetIndex * 1000 + this._index);

    if (vert) {
      container.items.forEach((v) => {
        Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, vm.itemRadius, vm.x - vm.width / 2 + random() * vm.width, v);
      });
    } else {
      container.items.forEach((v) => {
        Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, vm.itemRadius, v, vm.y - vm.height / 2 + random() * vm.height);
      });
    }
    ctx.restore();
  },
  _drawOutliers(vm, container, ctx, vert) {
    if (!container.outliers) {
      return;
    }
    ctx.fillStyle = vm.outlierColor;
    ctx.beginPath();
    if (vert) {
      container.outliers.forEach((v) => {
        ctx.arc(vm.x, v, vm.outlierRadius, 0, Math.PI * 2);
      });
    } else {
      container.outliers.forEach((v) => {
        ctx.arc(v, vm.y, vm.outlierRadius, 0, Math.PI * 2);
      });
    }
    ctx.fill();
    ctx.closePath();
  },

  _getBounds() {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  },
  _getHitBounds() {
    const padding = this._view.hitPadding;
    const b = this._getBounds();
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding
    };
  },
  height() {
    return 0; // abstract
  },
  inRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inLabelRange(mouseX, mouseY) {
    if (!this._view) {
      return false;
    }
    const bounds = this._getHitBounds();
    if (this.isVertical()) {
      return mouseX >= bounds.left && mouseX <= bounds.right;
    }
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  inXRange(mouseX) {
    const bounds = this._getHitBounds();
    return mouseX >= bounds.left && mouseX <= bounds.right;
  },
  inYRange(mouseY) {
    const bounds = this._getHitBounds();
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  },
  getCenterPoint() {
    const {x, y} = this._view;
    return {x, y};
  },
  getArea() {
    return 0; // abstract
  },
  tooltipPosition_() {
    return this.getCenterPoint();
  }
});

export default ArrayElementBase;
