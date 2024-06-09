import { InteractionItem, TooltipItem, Tooltip, TooltipModel } from 'chart.js';

export interface ExtendedTooltip extends TooltipModel<'boxplot' | 'violin'> {
  _tooltipOutlier?: {
    index: number;
    datasetIndex: number;
  };
  _tooltipItem?: {
    index: number;
    datasetIndex: number;
  };
}

/**
 * @hidden
 */
export function patchInHoveredOutlier(
  this: TooltipModel<'boxplot' | 'violin'>,
  item: TooltipItem<'boxplot' | 'violin'>
): void {
  const value = item.formattedValue as any;
  const that = this as ExtendedTooltip;
  if (value && that._tooltipOutlier != null && item.datasetIndex === that._tooltipOutlier.datasetIndex) {
    value.hoveredOutlierIndex = that._tooltipOutlier.index;
  }
  if (value && that._tooltipItem != null && item.datasetIndex === that._tooltipItem.datasetIndex) {
    value.hoveredItemIndex = that._tooltipItem.index;
  }
}

/**
 * based on average positioner but allow access to the tooltip instance
 * @hidden
 */
export function outlierPositioner(
  this: TooltipModel<'boxplot' | 'violin'>,
  items: readonly InteractionItem[],
  eventPosition: { x: number; y: number }
): false | { x: number; y: number } {
  if (!items.length) {
    return false;
  }
  let x = 0;
  let y = 0;
  let count = 0;
  for (let i = 0; i < items.length; i += 1) {
    const el = items[i].element;
    if (el && el.hasValue()) {
      const pos = (el as any).tooltipPosition(eventPosition, this);
      x += pos.x;
      y += pos.y;
      count += 1;
    }
  }
  return {
    x: x / count,
    y: y / count,
  };
}

outlierPositioner.id = 'average';
outlierPositioner.register = () => {
  Tooltip.positioners.average = outlierPositioner as any;
  return outlierPositioner;
};
