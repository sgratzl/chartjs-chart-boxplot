'use strict';

module.exports = function(Chart) {

	const helpers = Chart.helpers,
		globalOpts = Chart.defaults.global,
		defaultColor = globalOpts.defaultColor;

	globalOpts.elements.boxandwhiskers = {
		upCandleColor: "rgba(80, 160, 115, 1)",
		downCandleColor: "rgba(215, 85, 65, 1)",
		outlineCandleColor: "rgba(90, 90, 90, 1)",
		outlineCandleWidth: 1,
	};

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	/**
	 * Helper function to get the bounds of the candle
	 * @private
	 * @param bar {Chart.Element.Candlestick} the bar
	 * @return {Bounds} bounds of the bar
	 */
	function getBarBounds(candle) {
		const vm = candle._view;
		let x1, x2, y1, y2;

		const halfWidth = vm.width / 2;
		x1 = vm.x - halfWidth;
		x2 = vm.x + halfWidth;
		y1 = vm.candle.h;
		y2 = vm.candle.l;


		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.BoxAndWhiskers = Chart.Element.extend({
		draw: function() {
			const ctx = this._chart.ctx;
			const vm = this._view;
			let left, right, top, bottom, signX, signY, borderSkipped;
			const borderWidth = vm.borderWidth;


			const x = vm.x;
			const o = vm.candle.o;
			const h = vm.candle.h;
			const l = vm.candle.l;
			const c = vm.candle.c;

			ctx.strokeStyle = helpers.getValueOrDefault(vm.outlineCandleColor, globalOpts.elements.candlestick.outlineCandleColor);
			ctx.lineWidth = helpers.getValueOrDefault(vm.outlineCandleWidth, globalOpts.elements.candlestick.outlineCandleWidth);
			if (c < o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.upCandleColor, globalOpts.elements.candlestick.upCandleColor);
			} else if (c > o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.downCandleColor, globalOpts.elements.candlestick.downCandleColor);
			} else {
				ctx.fillStyle = helpers.getValueOrDefault(vm.outlineCandleColor, globalOpts.elements.candlestick.outlineCandleColor);
			}

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, l);
			ctx.stroke();
			ctx.fillRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.strokeRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.closePath();
		},
		height: function() {
			const vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function(mouseX, mouseY) {
			let inRange = false;

			if (this._view) {
				const bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function(mouseX, mouseY) {
			const me = this;
			if (!me._view) {
				return false;
			}

			let inRange = false;
			const bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function(mouseX) {
			const bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function(mouseY) {
			const bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function() {
			const vm = this._view;
			let x, y;

			const halfWidth = vm.width / 2;
			x = vm.x - halfWidth;
			y = (vm.candle.h + vm.candle.l) / 2;

			return { x: x, y: y };
		},
		getArea: function() {
			const vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			const vm = this._view;
			return {
				x: vm.x,
				y: (vm.candle.h + vm.candle.l) / 2
			};
		}
	});

};

