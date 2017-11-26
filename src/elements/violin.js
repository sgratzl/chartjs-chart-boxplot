'use strict';

import * as Chart from 'chart.js';
import ArrayElementBase, {defaults} from './base';


Chart.defaults.global.elements.violin = Object.assign({}, defaults);

const Violin = Chart.elements.Violin = ArrayElementBase.extend({
	draw() {
		const ctx = this._chart.ctx;
		const vm = this._view;

		const violin = vm.violin;
		const vert = this.isVertical();


		this._drawItems(vm, violin, ctx, vert);

		ctx.save();

		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = vm.borderWidth;

		ctx.beginPath();
		if (vert) {
			const {x, width} = vm;
			const x0 = x - width / 2;
		} else {
			const {y, height} = vm;
			const y0 = y - height / 2;
		}
		ctx.stroke();
		ctx.closePath();

		this._drawOutliers(vm, violin, ctx, vert);

		ctx.restore();

	},
	_getBounds() {
		const vm = this._view;

		const vert = this.isVertical();
		const violin = vm.violin;

		if (vert) {
			const {x, width} = vm;
			const x0 = x - width / 2;
			return {
				left: x0,
				top: violin.whiskerMax,
				right: x0 + width,
				bottom: violin.whiskerMin
			};
		} else {
			const {y, height} = vm;
			const y0 = y - height / 2;
			return {
				left: violin.whiskerMin,
				top: y0,
				right: violin.whiskerMax,
				bottom: y0 + height
			};
		}
	},
	height() {
		const vm = this._view;
		return vm.base - Math.min(vm.violin.q1, vm.violin.q3);
	},
	getArea() {
		const vm = this._view;
		const iqr = Math.abs(vm.violin.q3 - vm.violin.q1);
		if (this.isVertical()) {
			return iqr * vm.width;
		} else {
			return iqr * vm.height;
		}
	}
});

export default Violin;