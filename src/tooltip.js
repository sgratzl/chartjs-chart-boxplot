import { plugins } from 'chart.js';

export function boxplotPositioner(elements, eventPosition) {
  if (!elements.length) {
    return false;
  }

  const [x, y, count] = elements.reduce(
    ([xi, ci, counti], el) => {
      if (el && el.hasValue()) {
        const pos = el.tooltipPosition(eventPosition, this);
        return [xi + pos.x, ci + pos.y, counti + 1];
      }
      return [xi, ci, counti];
    },
    [0, 0, 0]
  );

  return {
    x: x / count,
    y: y / count,
  };
}

boxplotPositioner.id = 'boxplot';
boxplotPositioner.register = () => {
  // register my position logic
  const tooltip = plugins.getAll().find((d) => d.id === 'tooltip');
  tooltip.positioners[boxplotPositioner.id] = boxplotPositioner;
  return boxplotPositioner;
};
