'use strict';

import * as Chart from 'chart.js';
import ArrayElementBase, {defaults} from './base';


Chart.defaults.global.elements.violin = Object.assign({
	points: 100
}, defaults);

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

		const coords = violin.coords;

		Chart.canvasHelpers.drawPoint(ctx, 'rectRot', 5, vm.x, vm.y);
		ctx.stroke();

		ctx.beginPath();
		if (vert) {
			const {x, width} = vm;
			const factor = (width/2) / violin.maxEstimate;
			ctx.moveTo(x, violin.min);
			coords.forEach(({v, estimate}) => {
				ctx.lineTo(x - estimate * factor, v);
			});
			ctx.lineTo(x, violin.max);
			ctx.moveTo(x, violin.min);
			coords.forEach(({v, estimate}) => {
				ctx.lineTo(x + estimate * factor, v);
			});
			ctx.lineTo(x, violin.max);
		} else {
			const {y, height} = vm;
			const factor = (height/2) / violin.maxEstimate;
			ctx.moveTo(violin.min, y);
			coords.forEach(({v, estimate}) => {
				ctx.lineTo(v, y - estimate * factor);
			});
			ctx.lineTo(violin.max, y);
			ctx.moveTo(violin.min, y);
			coords.forEach(({v, estimate}) => {
				ctx.lineTo(v, y + estimate * factor);
			});
			ctx.lineTo(violin.max, y);
		}
		ctx.stroke();
		ctx.fill();
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
				top: violin.max,
				right: x0 + width,
				bottom: violin.min
			};
		} else {
			const {y, height} = vm;
			const y0 = y - height / 2;
			return {
				left: violin.min,
				top: y0,
				right: violin.max,
				bottom: y0 + height
			};
		}
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
		} else {
			return iqr * vm.height;
		}
	}
});

export default Violin;
