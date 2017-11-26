'use strict';

import * as Chart from 'chart.js';
import ArrayElementBase, {defaults} from './base'


Chart.defaults.global.elements.violin = Object.assign({}, defaults);

const Violin = Chart.elements.Violin = ArrayElementBase.extend({
	draw() {
		const ctx = this._chart.ctx;
		const vm = this._view;

		const boxplot = vm.boxplot;
		const vert = this.isVertical();


		this._drawItems(vm, boxplot, ctx, vert);

		ctx.save();

		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = vm.borderWidth;

		ctx.beginPath();
		if (vert) {
			const {x, width} = vm;
			const x0 = x - width / 2;
			ctx.fillRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
			ctx.strokeRect(x0, boxplot.q1, width, boxplot.q3 - boxplot.q1);
			ctx.moveTo(x0, boxplot.whiskerMin);
			ctx.lineTo(x0 + width, boxplot.whiskerMin);
			ctx.moveTo(x, boxplot.whiskerMin);
			ctx.lineTo(x, boxplot.q1);
			ctx.moveTo(x0, boxplot.whiskerMax);
			ctx.lineTo(x0 + width, boxplot.whiskerMax);
			ctx.moveTo(x, boxplot.whiskerMax);
			ctx.lineTo(x, boxplot.q3);
			ctx.moveTo(x0, boxplot.median);
			ctx.lineTo(x0 + width, boxplot.median);
		} else {
			const {y, height} = vm;
			const y0 = y - height / 2;
			ctx.fillRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);
			ctx.strokeRect(boxplot.q1, y0, boxplot.q3 - boxplot.q1, height);

			ctx.moveTo(boxplot.whiskerMin, y0);
			ctx.lineTo(boxplot.whiskerMin, y0 + height);
			ctx.moveTo(boxplot.whiskerMin, y);
			ctx.lineTo(boxplot.q1, y);
			ctx.moveTo(boxplot.whiskerMax, y0);
			ctx.lineTo(boxplot.whiskerMax, y0 + height);
			ctx.moveTo(boxplot.whiskerMax, y);
			ctx.lineTo(boxplot.q3, y);
			ctx.moveTo(boxplot.median, y0);
			ctx.lineTo(boxplot.median, y0 + height);
		}
		ctx.stroke();
		ctx.closePath();

		this._drawOutliers(vm, boxplot, ctx, vert);

		ctx.restore();

	},
	_getBounds() {
		const vm = this._view;

		const vert = this.isVertical();
		const boxplot = vm.boxplot;

		if (vert) {
			const {x, width} = vm;
			const x0 = x - width / 2;
			return {
				left: x0,
				top: boxplot.whiskerMax,
				right: x0 + width,
				bottom: boxplot.whiskerMin
			};
		} else {
			const {y, height} = vm;
			const y0 = y - height / 2;
			return {
				left: boxplot.whiskerMin,
				top: y0,
				right: boxplot.whiskerMax,
				bottom: y0 + height
			};
		}
	},
	height() {
		const vm = this._view;
		return vm.base - Math.min(vm.boxplot.q1, vm.boxplot.q3);
	},
	getArea() {
		const vm = this._view;
		const iqr = Math.abs(vm.boxplot.q3 - vm.boxplot.q1);
		if (this.isVertical()) {
			return iqr * vm.width;
		} else {
			return iqr * vm.height;
		}
	}
});

export default Violin;