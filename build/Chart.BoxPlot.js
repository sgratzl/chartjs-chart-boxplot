(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'chart.js'], factory) :
	(factory((global.ChartBoxPlot = global.ChartBoxPlot || {}),global.Chart));
}(this, (function (exports,Chart) { 'use strict';

var ascending = function (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function (compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function left(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }
      return lo;
    },
    right: function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function (d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

function pair(a, b) {
  return [a, b];
}

var number = function (x) {
  return x === null ? NaN : +x;
};

var extent = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
};

var identity = function (x) {
  return x;
};

var d3range = function (start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
}

var sturges = function (values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var quantile = function (values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
};

var d3max = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
};

var min = function (values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
};

function length(d) {
  return d.length;
}

// See <http://en.wikipedia.org/wiki/Kernel_(statistics)>.










function gaussian(u) {
	return 1 / Math.sqrt(2 * Math.PI) * Math.exp(-.5 * u * u);
}

// Welford's algorithm.
function mean$1(x) {
  var n = x.length;
  if (n === 0) return NaN;
  var m = 0,
      i = -1;
  while (++i < n) {
    m += (x[i] - m) / (i + 1);
  }return m;
}

// Unbiased estimate of a sample's variance.
// Also known as the sample variance, where the denominator is n - 1.
function variance$1(x) {
  var n = x.length;
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var mean = mean$1(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - mean;
    s += v * v;
  }
  return s / (n - 1);
}

function ascending$1(a, b) {
  return a - b;
}

// Uses R's quantile algorithm type=7.
function quantiles(d, quantiles) {
  d = d.slice().sort(ascending$1);
  var n_1 = d.length - 1;
  return quantiles.map(function (q) {
    if (q === 0) return d[0];else if (q === 1) return d[n_1];

    var index = 1 + q * n_1,
        lo = Math.floor(index),
        h = index - lo,
        a = d[lo - 1];

    return h === 0 ? a : a + h * (d[lo] - a);
  });
}

function iqr(x) {
  var quartiles = quantiles(x, [.25, .75]);
  return quartiles[1] - quartiles[0];
}

// Bandwidth selectors for Gaussian kernels.
// Based on R's implementations in `stats.bw`.

// Silverman, B. W. (1986) Density Estimation. London: Chapman and Hall.


// Scott, D. W. (1992) Multivariate Density Estimation: Theory, Practice, and
// Visualization. Wiley.
function nrd(x) {
    var h = iqr(x) / 1.34;
    return 1.06 * Math.min(Math.sqrt(variance$1(x)), h) * Math.pow(x.length, -1 / 5);
}

function functor(v) {
  return typeof v === "function" ? v : function () {
    return v;
  };
}

// http://exploringdata.net/den_trac.htm
function kde() {
  var kernel = gaussian,
      sample = [],
      bandwidth = nrd;

  function kde(points, i) {
    var bw = bandwidth.call(this, sample);
    return points.map(function (x) {
      var i = -1,
          y = 0,
          n = sample.length;
      while (++i < n) {
        y += kernel((x - sample[i]) / bw);
      }
      return [x, y / bw / n];
    });
  }

  kde.kernel = function (x) {
    if (!arguments.length) return kernel;
    kernel = x;
    return kde;
  };

  kde.sample = function (x) {
    if (!arguments.length) return sample;
    sample = x;
    return kde;
  };

  kde.bandwidth = function (x) {
    if (!arguments.length) return bandwidth;
    bandwidth = functor(x);
    return kde;
  };

  return kde;
}

function whiskers(boxplot) {
	var iqr = boxplot.q3 - boxplot.q1;
	// since top left is max
	var whiskerMin = Math.max(boxplot.min, boxplot.q1 - iqr);
	var whiskerMax = Math.min(boxplot.max, boxplot.q3 + iqr);
	return { whiskerMin: whiskerMin, whiskerMax: whiskerMax };
}

function boxplotStats(arr) {
	// console.assert(Array.isArray(arr));
	if (arr.length === 0) {
		return {
			min: NaN,
			max: NaN,
			median: NaN,
			q1: NaN,
			q3: NaN,
			whiskerMin: NaN,
			whiskerMax: NaN,
			outliers: []
		};
	}
	arr = arr.filter(function (v) {
		return typeof v === 'number' && !isNaN(v);
	});
	arr.sort(function (a, b) {
		return a - b;
	});

	var minmax = extent(arr);
	var base = {
		min: minmax[0],
		max: minmax[1],
		median: quantile(arr, 0.5),
		q1: quantile(arr, 0.25),
		q3: quantile(arr, 0.75),
		outliers: []
	};

	var _whiskers = whiskers(base),
	    whiskerMin = _whiskers.whiskerMin,
	    whiskerMax = _whiskers.whiskerMax;

	base.outliers = arr.filter(function (v) {
		return v < whiskerMin || v > whiskerMax;
	});
	base.whiskerMin = whiskerMin;
	base.whiskerMax = whiskerMax;
	return base;
}

function violinStats(arr) {
	// console.assert(Array.isArray(arr));
	if (arr.length === 0) {
		return {
			outliers: []
		};
	}
	arr = arr.filter(function (v) {
		return typeof v === 'number' && !isNaN(v);
	});
	arr.sort(function (a, b) {
		return a - b;
	});

	var minmax = extent(arr);
	return {
		min: minmax[0],
		max: minmax[1],
		median: quantile(arr, 0.5),
		kde: kde().sample(arr)
	};
}

function asBoxPlotStats(value) {
	if (typeof value.median === 'number' && typeof value.q1 === 'number' && typeof value.q3 === 'number') {
		// sounds good, check for helper
		if (typeof value.whiskerMin === 'undefined') {
			var _whiskers2 = whiskers(value),
			    whiskerMin = _whiskers2.whiskerMin,
			    whiskerMax = _whiskers2.whiskerMax;

			value.whiskerMin = whiskerMin;
			value.whiskerMax = whiskerMax;
		}
		return value;
	}
	if (!Array.isArray(value)) {
		return undefined;
	}
	if (value.__stats === undefined) {
		value.__stats = boxplotStats(value);
	}
	return value.__stats;
}

function asViolinStats(value) {
	if (typeof value.median === 'number' && (typeof value.kde === 'function' || Array.isArray(value.coords))) {
		return value;
	}
	if (!Array.isArray(value)) {
		return undefined;
	}
	if (value.__kde === undefined) {
		value.__kde = violinStats(value);
	}
	return value.__kde;
}

function asMinMaxStats(value) {
	if (typeof value.min === 'number' && typeof value.max === 'number') {
		return value;
	}
	if (!Array.isArray(value)) {
		return undefined;
	}
	return asBoxPlotStats(value);
}

function getRightValue(rawValue) {
	if (!rawValue) {
		return rawValue;
	}
	if (typeof rawValue === 'number' || typeof rawValue === 'string') {
		return Number(rawValue);
	}
	var b = asBoxPlotStats(rawValue);
	return b ? b.median : rawValue;
}

function commonDataLimits(extraCallback) {
	var _this = this;

	var chart = this.chart;
	var isHorizontal = this.isHorizontal();

	var matchID = function matchID(meta) {
		return isHorizontal ? meta.xAxisID === _this.id : meta.yAxisID === _this.id;
	};

	// First Calculate the range
	this.min = null;
	this.max = null;

	// Regular charts use x, y values
	// For the boxplot chart we have rawValue.min and rawValue.max for each point
	chart.data.datasets.forEach(function (d, i) {
		var meta = chart.getDatasetMeta(i);
		if (!chart.isDatasetVisible(i) || !matchID(meta)) {
			return;
		}
		d.data.forEach(function (value, j) {
			if (!value || meta.data[j].hidden) {
				return;
			}
			var minmax = asMinMaxStats(value);
			if (!minmax) {
				return;
			}
			if (_this.min === null) {
				_this.min = minmax.min;
			} else if (minmax.min < _this.min) {
				_this.min = minmax.min;
			}

			if (_this.max === null) {
				_this.max = minmax.max;
			} else if (minmax.max > _this.max) {
				_this.max = minmax.max;
			}

			if (extraCallback) {
				extraCallback(minmax);
			}
		});
	});
}

function rnd(seed) {
	// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	if (seed === undefined) {
		seed = Date.now();
	}
	return function () {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}

var defaults$1 = Object.assign({}, Chart.defaults.global.elements.rectangle, {
	borderWidth: 1,
	outlierRadius: 2,
	itemRadius: 2,
	itemStyle: 'circle',
	itemBackgroundColor: Chart.defaults.global.elements.rectangle.backgroundColor,
	itemBorderColor: Chart.defaults.global.elements.rectangle.borderColor
});

var ArrayElementBase = Chart.Element.extend({
	isVertical: function isVertical() {
		return this._view.width !== undefined;
	},
	draw: function draw() {
		// abstract
	},
	_drawItems: function _drawItems(vm, container, ctx, vert) {
		if (vm.itemRadius <= 0 || !container.items || container.items.length <= 0) {
			return;
		}
		ctx.save();
		ctx.strokeStle = vm.itemBorderColor;
		ctx.fillStyle = vm.itemBackgroundColor;
		// jitter based on random data
		// use the median to initialize the random number generator
		var random = rnd(container.median);

		var itemRadius = vm.itemRadius;
		if (vert) {
			var x = vm.x,
			    width = vm.width;

			container.items.forEach(function (v) {
				Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, itemRadius, x - width / 2 + random() * width, v);
			});
		} else {
			var y = vm.y,
			    height = vm.height;

			container.items.forEach(function (v) {
				Chart.canvasHelpers.drawPoint(ctx, vm.itemStyle, itemRadius, v, y - height / 2 + random() * height);
			});
		}
		ctx.restore();
	},
	_drawOutliers: function _drawOutliers(vm, container, ctx, vert) {
		if (!container.outliers) {
			return;
		}
		var outlierRadius = vm.outlierRadius;
		ctx.fillStyle = vm.outlierColor;
		ctx.beginPath();
		if (vert) {
			var x = vm.x;
			container.outliers.forEach(function (v) {
				ctx.arc(x, v, outlierRadius, 0, Math.PI * 2);
			});
		} else {
			var y = vm.y;
			container.outliers.forEach(function (v) {
				ctx.arc(v, y, outlierRadius, 0, Math.PI * 2);
			});
		}
		ctx.fill();
		ctx.closePath();
	},
	_getBounds: function _getBounds() {
		// abstract
		return {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		};
	},
	height: function height() {
		return 0; // abstract
	},
	inRange: function inRange(mouseX, mouseY) {
		if (!this._view) {
			return false;
		}
		var bounds = this._getBounds();
		return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	inLabelRange: function inLabelRange(mouseX, mouseY) {
		if (!this._view) {
			return false;
		}
		var bounds = this._getBounds();
		if (this.isVertical()) {
			return mouseX >= bounds.left && mouseX <= bounds.right;
		}
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	inXRange: function inXRange(mouseX) {
		var bounds = this._getBounds();
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},
	inYRange: function inYRange(mouseY) {
		var bounds = this._getBounds();
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	getCenterPoint: function getCenterPoint() {
		var _view = this._view,
		    x = _view.x,
		    y = _view.y;

		return { x: x, y: y };
	},
	getArea: function getArea() {
		return 0; // abstract
	},
	tooltipPosition_: function tooltipPosition_() {
		return this.getCenterPoint();
	}
});

Chart.defaults.global.elements.boxandwhiskers = Object.assign({}, defaults$1);

var BoxAndWiskers = Chart.elements.BoxAndWhiskers = ArrayElementBase.extend({
	draw: function draw() {
		var ctx = this._chart.ctx;
		var vm = this._view;

		var boxplot = vm.boxplot;
		var vert = this.isVertical();

		this._drawItems(vm, boxplot, ctx, vert);

		ctx.save();

		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = vm.borderWidth;

		this._drawBoxPlot(vm, boxplot, ctx, vert);
		this._drawOutliers(vm, boxplot, ctx, vert);

		ctx.restore();
	},
	_drawBoxPlot: function _drawBoxPlot(vm, boxplot, ctx, vert) {
		ctx.beginPath();
		if (vert) {
			var x = vm.x,
			    width = vm.width;

			var x0 = x - width / 2;
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
			var y = vm.y,
			    height = vm.height;

			var y0 = y - height / 2;
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
	},
	_getBounds: function _getBounds() {
		var vm = this._view;

		var vert = this.isVertical();
		var boxplot = vm.boxplot;

		if (vert) {
			var x = vm.x,
			    width = vm.width;

			var x0 = x - width / 2;
			return {
				left: x0,
				top: boxplot.whiskerMax,
				right: x0 + width,
				bottom: boxplot.whiskerMin
			};
		}
		var y = vm.y,
		    height = vm.height;

		var y0 = y - height / 2;
		return {
			left: boxplot.whiskerMin,
			top: y0,
			right: boxplot.whiskerMax,
			bottom: y0 + height
		};
	},
	height: function height() {
		var vm = this._view;
		return vm.base - Math.min(vm.boxplot.q1, vm.boxplot.q3);
	},
	getArea: function getArea() {
		var vm = this._view;
		var iqr = Math.abs(vm.boxplot.q3 - vm.boxplot.q1);
		if (this.isVertical()) {
			return iqr * vm.width;
		}
		return iqr * vm.height;
	}
});

Chart.defaults.global.elements.violin = Object.assign({
	points: 100
}, defaults$1);

var Violin = Chart.elements.Violin = ArrayElementBase.extend({
	draw: function draw() {
		var ctx = this._chart.ctx;
		var vm = this._view;

		var violin = vm.violin;
		var vert = this.isVertical();

		this._drawItems(vm, violin, ctx, vert);

		ctx.save();

		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;
		ctx.lineWidth = vm.borderWidth;

		var coords = violin.coords;

		Chart.canvasHelpers.drawPoint(ctx, 'rectRot', 5, vm.x, vm.y);
		ctx.stroke();

		ctx.beginPath();
		if (vert) {
			var x = vm.x,
			    width = vm.width;

			var factor = width / 2 / violin.maxEstimate;
			ctx.moveTo(x, violin.min);
			coords.forEach(function (_ref) {
				var v = _ref.v,
				    estimate = _ref.estimate;

				ctx.lineTo(x - estimate * factor, v);
			});
			ctx.lineTo(x, violin.max);
			ctx.moveTo(x, violin.min);
			coords.forEach(function (_ref2) {
				var v = _ref2.v,
				    estimate = _ref2.estimate;

				ctx.lineTo(x + estimate * factor, v);
			});
			ctx.lineTo(x, violin.max);
		} else {
			var y = vm.y,
			    height = vm.height;

			var _factor = height / 2 / violin.maxEstimate;
			ctx.moveTo(violin.min, y);
			coords.forEach(function (_ref3) {
				var v = _ref3.v,
				    estimate = _ref3.estimate;

				ctx.lineTo(v, y - estimate * _factor);
			});
			ctx.lineTo(violin.max, y);
			ctx.moveTo(violin.min, y);
			coords.forEach(function (_ref4) {
				var v = _ref4.v,
				    estimate = _ref4.estimate;

				ctx.lineTo(v, y + estimate * _factor);
			});
			ctx.lineTo(violin.max, y);
		}
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		this._drawOutliers(vm, violin, ctx, vert);

		ctx.restore();
	},
	_getBounds: function _getBounds() {
		var vm = this._view;

		var vert = this.isVertical();
		var violin = vm.violin;

		if (vert) {
			var x = vm.x,
			    width = vm.width;

			var x0 = x - width / 2;
			return {
				left: x0,
				top: violin.max,
				right: x0 + width,
				bottom: violin.min
			};
		}
		var y = vm.y,
		    height = vm.height;

		var y0 = y - height / 2;
		return {
			left: violin.min,
			top: y0,
			right: violin.max,
			bottom: y0 + height
		};
	},
	height: function height() {
		var vm = this._view;
		return vm.base - Math.min(vm.violin.min, vm.violin.max);
	},
	getArea: function getArea() {
		var vm = this._view;
		var iqr = Math.abs(vm.violin.max - vm.violin.min);
		if (this.isVertical()) {
			return iqr * vm.width;
		}
		return iqr * vm.height;
	}
});

var verticalDefaults = {
	scales: {
		yAxes: [{
			type: 'arrayLinear'
		}]
	}
};
var horizontalDefaults = {
	scales: {
		xAxes: [{
			type: 'arrayLinear'
		}]
	}
};

var array$1 = {
	_elementOptions: function _elementOptions() {
		return {};
	},
	updateElement: function updateElement(elem, index, reset) {
		var dataset = this.getDataset();
		var custom = elem.custom || {};
		var options = this._elementOptions();

		Chart.controllers.bar.prototype.updateElement.call(this, elem, index, reset);
		['outlierRadius', 'itemRadius', 'itemStyle', 'itemBackgroundColor', 'itemBorderColor', 'outlierColor'].forEach(function (item) {
			elem._model[item] = custom[item] !== undefined ? custom[item] : Chart.helpers.valueAtIndexOrDefault(dataset[item], index, options[item]);
		});
	},
	_calculateCommonModel: function _calculateCommonModel(r, data, container, scale) {
		if (container.outliers) {
			r.outliers = container.outliers.map(function (d) {
				return scale.getPixelForValue(Number(d));
			});
		}

		if (Array.isArray(data)) {
			r.items = data.map(function (d) {
				return scale.getPixelForValue(Number(d));
			});
		}
	}
};

var defaults$2 = {
	tooltips: {
		callbacks: {
			label: function label(item, data) {
				var datasetLabel = data.datasets[item.datasetIndex].label || '';
				var value = data.datasets[item.datasetIndex].data[item.index];
				var b = asBoxPlotStats(value);
				var label = datasetLabel + ' ' + (typeof item.xLabel === 'string' ? item.xLabel : item.yLabel);
				if (!b) {
					return label + 'NaN';
				}
				return label + ' (min: ' + b.min + ', q1: ' + b.q1 + ', median: ' + b.median + ', q3: ' + b.q3 + ', max: ' + b.max + ')';
			}
		}
	}
};

Chart.defaults.boxplot = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults$2]);
Chart.defaults.horizontalBoxplot = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults$2]);

var boxplot = Object.assign({}, array$1, {

	dataElementType: Chart.elements.BoxAndWhiskers,

	_elementOptions: function _elementOptions() {
		return this.chart.options.elements.boxandwhiskers;
	},

	/**
  * @private
  */
	updateElementGeometry: function updateElementGeometry(elem, index, reset) {
		Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
		elem._model.boxplot = this._calculateBoxPlotValuesPixels(this.index, index);
	},


	/**
  * @private
  */

	_calculateBoxPlotValuesPixels: function _calculateBoxPlotValuesPixels(datasetIndex, index) {
		var scale = this.getValueScale();
		var data = this.chart.data.datasets[datasetIndex].data[index];
		var v = asBoxPlotStats(data);

		var r = {};
		Object.keys(v).forEach(function (key) {
			if (key !== 'outliers') {
				r[key] = scale.getPixelForValue(Number(v[key]));
			}
		});
		this._calculateCommonModel(r, data, v, scale);
		return r;
	}
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
var BoxPlot = Chart.controllers.boxplot = Chart.controllers.bar.extend(boxplot);
var HorizontalBoxPlot = Chart.controllers.horizontalBoxplot = Chart.controllers.horizontalBar.extend(boxplot);

var defaults$3 = {};

Chart.defaults.violin = Chart.helpers.merge({}, [Chart.defaults.bar, verticalDefaults, defaults$3]);
Chart.defaults.horizontalViolin = Chart.helpers.merge({}, [Chart.defaults.horizontalBar, horizontalDefaults, defaults$3]);

var controller = Object.assign({}, array$1, {

	dataElementType: Chart.elements.Violin,

	_elementOptions: function _elementOptions() {
		return this.chart.options.elements.violin;
	},

	/**
  * @private
  */
	updateElementGeometry: function updateElementGeometry(elem, index, reset) {
		Chart.controllers.bar.prototype.updateElementGeometry.call(this, elem, index, reset);
		var custom = elem.custom || {};
		var options = this._elementOptions();
		elem._model.violin = this._calculateViolinValuesPixels(this.index, index, custom.points !== undefined ? custom.points : options.points);
	},


	/**
  * @private
  */

	_calculateViolinValuesPixels: function _calculateViolinValuesPixels(datasetIndex, index, points) {
		var scale = this.getValueScale();
		var data = this.chart.data.datasets[datasetIndex].data[index];
		var violin = asViolinStats(data);

		var range$$1 = violin.max - violin.min;
		var samples = d3range(violin.min, violin.max, range$$1 / points);
		if (samples[samples.length - 1] !== violin.max) {
			samples.push(violin.max);
		}
		var coords = violin.coords || violin.kde(samples).map(function (v) {
			return { v: v[0], estimate: v[1] };
		});
		var r = {
			min: scale.getPixelForValue(violin.min),
			max: scale.getPixelForValue(violin.max),
			median: scale.getPixelForValue(violin.median),
			coords: coords.map(function (_ref) {
				var v = _ref.v,
				    estimate = _ref.estimate;
				return { v: scale.getPixelForValue(v), estimate: estimate };
			}),
			maxEstimate: d3max(coords, function (d) {
				return d.estimate;
			})
		};
		this._calculateCommonModel(r, data, violin, scale);
		return r;
	}
});
/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
var Violin$2 = Chart.controllers.violin = Chart.controllers.bar.extend(controller);
var HorizontalViolin = Chart.controllers.horizontalViolin = Chart.controllers.horizontalBar.extend(controller);

var ArrayLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({
	getRightValue: function getRightValue$$1(rawValue) {
		return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue));
	},
	determineDataLimits: function determineDataLimits() {
		commonDataLimits.call(this);
		// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
		this.handleTickRangeOptions();
	}
});
Chart.scaleService.registerScaleType('arrayLinear', ArrayLinearScale, Chart.scaleService.getScaleDefaults('linear'));

var helpers$1 = Chart.helpers;

var ArrayLogarithmicScale = Chart.scaleService.getScaleConstructor('logarithmic').extend({
	getRightValue: function getRightValue$$1(rawValue) {
		return Chart.LinearScaleBase.prototype.getRightValue.call(this, getRightValue(rawValue));
	},
	determineDataLimits: function determineDataLimits() {
		var _this = this;

		this.minNotZero = null;
		commonDataLimits.call(this, function (boxPlot) {
			if (boxPlot.min !== 0 && (_this.minNotZero === null || boxPlot.min < _this.minNotZero)) {
				_this.minNotZero = boxPlot.min;
			}
		});

		// Add whitespace around bars. Axis shouldn't go exactly from min to max
		var tickOpts = this.options.ticks;
		this.min = helpers$1.valueOrDefault(tickOpts.min, this.min - this.min * 0.05);
		this.max = helpers$1.valueOrDefault(tickOpts.max, this.max + this.max * 0.05);

		if (this.min === this.max) {
			if (this.min !== 0 && this.min !== null) {
				this.min = Math.pow(10, Math.floor(helpers$1.log10(this.min)) - 1);
				this.max = Math.pow(10, Math.floor(helpers$1.log10(this.max)) + 1);
			} else {
				this.min = 1;
				this.max = 10;
			}
		}
	}
});
Chart.scaleService.registerScaleType('arrayLogarithmic', ArrayLogarithmicScale, Chart.scaleService.getScaleDefaults('logarithmic'));

exports.BoxAndWhiskers = BoxAndWiskers;
exports.Violin = Violin;
exports.ArrayLinearScale = ArrayLinearScale;
exports.ArrayLogarithmicScale = ArrayLogarithmicScale;
exports.BoxPlot = BoxPlot;
exports.HorizontalBoxPlot = HorizontalBoxPlot;
exports.HorizontalViolin = HorizontalViolin;

Object.defineProperty(exports, '__esModule', { value: true });

})));
