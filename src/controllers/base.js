import { interpolateNumberArray } from '../animation';
import { outlierPositioner, patchInHoveredOutlier } from '../tooltip';

export const configKeys = [
  'outlierRadius',
  'itemRadius',
  'itemStyle',
  'itemBackgroundColor',
  'itemBorderColor',
  'outlierColor',
  'medianColor',
  'hitPadding',
  'outlierHitRadius',
  'lowerColor',
];
export const colorStyleKeys = ['borderColor', 'backgroundColor'].concat(configKeys.filter((c) => c.endsWith('Color')));

export function baseDefaults() {
  return {
    datasets: {
      animation: {
        numberArray: {
          fn: interpolateNumberArray,
          properties: ['outliers', 'items'],
        },
        colors: {
          type: 'color',
          properties: colorStyleKeys,
        },
        show: {
          colors: {
            type: 'color',
            properties: colorStyleKeys,
            from: 'transparent',
          },
        },
        hide: {
          colors: {
            type: 'color',
            properties: colorStyleKeys,
            to: 'transparent',
          },
        },
      },
    },
    tooltips: {
      position: outlierPositioner.register().id,
      callbacks: {
        beforeLabel: patchInHoveredOutlier,
      },
    },
  };
}
