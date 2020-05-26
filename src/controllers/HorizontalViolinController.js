import { Chart, defaults, merge, registerController, patchControllerConfig } from '../chart';
import { baseDefaults } from './base';
import { baseOptionKeys } from '../elements/base';
import { Violin } from '../elements';
import { interpolateKdeCoords } from '../animation';
import { ViolinController } from './ViolinController';

export class HorizontalViolinController extends ViolinController {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}

HorizontalViolinController.id = 'horizontalViolin';
HorizontalViolinController.defaults = /*#__PURE__*/ merge({}, [
  defaults.horizontalBar,
  baseDefaults(baseOptionKeys),
  {
    datasets: {
      points: 100,
      animation: {
        numbers: {
          type: 'number',
          properties: defaults.bar.datasets.animation.numbers.properties.concat(
            ['q1', 'q3', 'min', 'max', 'median', 'maxEstimate'],
            baseOptionKeys.filter((c) => !c.endsWith('Color'))
          ),
        },
        kdeCoords: {
          fn: interpolateKdeCoords,
          properties: ['coords'],
        },
      },
    },
  },
]);
HorizontalViolinController.register = () => {
  HorizontalViolinController.prototype.dataElementType = Violin.register();
  HorizontalViolinController.prototype.dataElementOptions = HorizontalViolinController.prototype.dataElementOptions.concat(
    baseOptionKeys
  );
  return registerController(HorizontalViolinController);
};

export class HorizontalViolinChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, HorizontalViolinController));
  }
}
HorizontalViolinChart.id = HorizontalViolinController.id;
