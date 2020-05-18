import { plugins } from 'chart.js';

export function patchInHoveredOutlier(item) {
  const value = item.value;
  const hoveredOutlierIndex =
    this._tooltipOutlier == null || item.datasetIndex !== this._tooltipOutlier.datasetIndex
      ? -1
      : this._tooltipOutlier.index;
  // patch in the hovered outlier index
  value.hoveredOutlierIndex = hoveredOutlierIndex;
}

// based on average positioner but allow access to the tooltip instance
export function outlierPositioner(items, eventPosition) {
  if (!items.length) {
    return false;
  }
  var i, len;
  var x = 0;
  var y = 0;
  var count = 0;
  for (i = 0, len = items.length; i < len; ++i) {
    var el = items[i].element;
    if (el && el.hasValue()) {
      var pos = el.tooltipPosition(eventPosition, this);
      x += pos.x;
      y += pos.y;
      ++count;
    }
  }
  return {
    x: x / count,
    y: y / count,
  };
}

outlierPositioner.id = 'averageInstance';
outlierPositioner.register = () => {
  // register my position logic
  const tooltip = plugins.getAll().find((d) => d.id === 'tooltip');
  tooltip.positioners[outlierPositioner.id] = outlierPositioner;
  return outlierPositioner;
};
