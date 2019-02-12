'use strict';

window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

(function(global) {
  var Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  var COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];

  var Samples = global.Samples || (global.Samples = {});
  var Color = global.Color;

  Samples.utils = {
    // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    srand: function(seed) {
      this._seed = seed;
    },

    randF: function(min, max) {
      min = min === undefined ? 0 : min;
      max = max === undefined ? 1 : max;
      return () => {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        return min + (this._seed / 233280) * (max - min);
      };
    },

    rand: function(min, max) {
      return this.randF(min, max)();
    },

    numbers: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 100;
      var from = cfg.from || [];
      var count = cfg.count || 8;
      var decimals = cfg.decimals || 8;
      var continuity = cfg.continuity || 1;
      var dfactor = Math.pow(10, decimals) || 0;
      var data = [];
      var i, value;
      var rand = cfg.random ? cfg.random(min, max) : this.randF(min, max);
      var rand01 = cfg.random01 ? cfg.random01() : this.randF();

      for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + rand();
        if (rand01() <= continuity) {
          data.push(Math.round(dfactor * value) / dfactor);
        } else {
          data.push(null);
        }
      }

      return data;
    },

    randomBoxPlot: function(config) {
      const base = this.numbers({...config, count: 10});
      base.sort(function(a,b) { return a - b; });
      const shift = 3;
      return {
        min: base[shift + 0],
        q1: base[shift + 1],
        median: base[shift + 2],
        q3: base[shift + 3],
        max: base[shift + 4],
        outliers: base.slice(0, 3).concat(base.slice(shift + 5))
      };
    },

    boxplots: function(config) {
      const count = (config || {}).count || 8;
      const data = [];
      for(let i = 0; i < count; ++i) {
        data.push(this.randomBoxPlot(config));
      }
      return data;
    },

    boxplotsArray: function(config) {
      const count = (config || {}).count || 8;
      const data = [];
      for(let i = 0; i < count; ++i) {
        data.push(this.numbers({...config, count: 50}));
      }
      return data;
    },

    labels: function(config) {
      var cfg = config || {};
      var min = cfg.min || 0;
      var max = cfg.max || 100;
      var count = cfg.count || 8;
      var step = (max - min) / count;
      var decimals = cfg.decimals || 8;
      var dfactor = Math.pow(10, decimals) || 0;
      var prefix = cfg.prefix || '';
      var values = [];
      var i;

      for (i = min; i < max; i += step) {
        values.push(prefix + Math.round(dfactor * i) / dfactor);
      }

      return values;
    },

    months: function(config) {
      var cfg = config || {};
      var count = cfg.count || 12;
      var section = cfg.section;
      var values = [];
      var i, value;

      for (i = 0; i < count; ++i) {
        value = Months[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
      }

      return values;
    },

    nextMonth: function(count) {
      return Months[Math.ceil(count + 1) % 12];
    },

    color: function(index) {
      return COLORS[index % COLORS.length];
    },

    transparentize: function(color, opacity) {
      var alpha = opacity === undefined ? 0.5 : 1 - opacity;
      return Color(color).alpha(alpha).rgbString();
    }
  };

  // DEPRECATED
  window.randomScalingFactor = function() {
    return Math.round(Samples.utils.rand(-100, 100));
  };

  // INITIALIZATION

  Samples.utils.srand(Date.now());

}(this));
