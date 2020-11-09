import { InteractionItem, TooltipItem, Tooltip, TooltipModel } from 'chart.js';

export interface ExtendedTooltip extends TooltipModel {
  _tooltipOutlier?: {
    index: number;
    datasetIndex: number;
  };
}

export function patchInHoveredOutlier(this: TooltipModel, item: TooltipItem) {
  const value = item.formattedValue as any;
  const that = this as ExtendedTooltip;
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
  let x = 0;
  let y = 0;
  let count = 0;
  for (let i = 0; i < items.length; ++i) {
    const el = items[i].element;
    if (el && el.hasValue()) {
      const pos = (el as any).tooltipPosition(eventPosition, this);
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
