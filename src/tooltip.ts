import { InteractionItem, ITooltipItem, Tooltip, TooltipModel } from '@sgratzl/chartjs-esm-facade';

export interface IExtendedTooltip extends TooltipModel {
  _tooltipOutlier?: {
    index: number;
    datasetIndex: number;
  };
}

export function patchInHoveredOutlier(this: TooltipModel, item: ITooltipItem) {
  const value = item.formattedValue as any;
  const that = this as IExtendedTooltip;
  if (value && that._tooltipOutlier != null && item.datasetIndex === that._tooltipOutlier.datasetIndex) {
    value.hoveredOutlierIndex = that._tooltipOutlier.index;
  }
}

// based on average positioner but allow access to the tooltip instance
export function outlierPositioner(
  this: TooltipModel,
  items: readonly InteractionItem[],
  eventPosition: { x: number; y: number }
) {
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
      var pos = (el as any).tooltipPosition(eventPosition, this);
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
  Tooltip.positioners.averageInstance = outlierPositioner as any;
  return outlierPositioner;
};
