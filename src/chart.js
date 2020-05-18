import ChartNS from 'chart.js';

export const Chart = ChartNS;
export const plugins = ChartNS.plugins;
export const controllers = ChartNS.controllers;
export const defaults = ChartNS.defaults;
export const helpers = ChartNS.helpers;
// export const scaleService = ChartNS.scaleService;

// export const DataSetController = ChartNS.DataSetController;
export const BarController = controllers.bar;
export const HorizontalBarController = controllers.horizontalBar;
// export const LineController = controllers.line;
// export const PolarAreaController = controllers.polarArea;
// export const ScatterController = controllers.scatter;

export const Element = ChartNS.Element;
// export const Rectangle = ChartNS.elements.Rectangle;
// export const Point = ChartNS.elements.Point;
// export const Line = ChartNS.elements.Line;

export const merge = ChartNS.helpers.merge;
export const drawPoint = ChartNS.helpers.canvas.drawPoint;
