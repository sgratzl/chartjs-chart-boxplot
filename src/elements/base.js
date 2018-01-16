'use strict';

import * as Chart from 'chart.js';
import {rnd} from '../data';

export const defaults = Object.assign({}, Chart.defaults.global.elements.rectangle, {
	borderWidth: 1,
	outlierRadius: 2,
	outlierColor: Chart.defaults.global.elements.arc.fillStyle,
	itemRadius: 2,
	itemStyle: 'circle',
	itemBackgroundColor: Chart.defaults.global.elements.rectangle.backgroundColor,
	itemBorderColor: Chart.defaults.global.elements.rectangle.borderColor,
});

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
		// use the median to initialize the random number generator
		const random = rnd(container.median);

		const itemRadius = vm.itemRadius;
		if (vert) {
			const {x, width} = vm;
			container.items.forEach((v) => {
				Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, itemRadius, x - width / 2 + random() * width, v);
			});
		} else {
			const {y, height} = vm;
			container.items.forEach((v) => {
				Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, itemRadius, v, y - height / 2 + random() * height);
			});
		}
		ctx.restore();
	},
	_drawOutliers(vm, container, ctx, vert) {
		if (!container.outliers) {
			return;
		}
		const outlierRadius = vm.outlierRadius;
		ctx.fillStyle = vm.outlierColor;
		ctx.beginPath();
		if (vert) {
			const x = vm.x;
			container.outliers.forEach((v) => {
				ctx.arc(x, v, outlierRadius, 0, Math.PI * 2);
			});
		} else {
			const y = vm.y;
			container.outliers.forEach((v) => {
				ctx.arc(v, y, outlierRadius, 0, Math.PI * 2);
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
	height() {
		return 0; // abstract
	},
	inRange(mouseX, mouseY) {
		if (!this._view) {
			return false;
		}
		const bounds = this._getBounds();
		return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	inLabelRange(mouseX, mouseY) {
		if (!this._view) {
			return false;
		}
		const bounds = this._getBounds();
		if (this.isVertical()) {
			return mouseX >= bounds.left && mouseX <= bounds.right;
		}
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	inXRange(mouseX) {
		const bounds = this._getBounds();
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},
	inYRange(mouseY) {
		const bounds = this._getBounds();
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
