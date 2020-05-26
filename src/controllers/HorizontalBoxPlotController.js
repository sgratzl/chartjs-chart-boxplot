import { Chart, patchControllerConfig, registerController, defaults, HorizontalBarController, merge } from '../chart';
import { baseDefaults } from './base';
import { BoxAndWiskers, boxOptionsKeys } from '../elements';
import { BoxPlotController } from './BoxPlotController';

export class HorizontalBoxPlotController extends BoxPlotController {
  getValueScaleId() {
    return this._cachedMeta.xAxisID;
  }
  getIndexScaleId() {
    return this._cachedMeta.yAxisID;
  }
}

HorizontalBoxPlotController.id = 'horizontalBoxplot';
HorizontalBoxPlotController.defaults = /*#__PURE__*/ merge({}, [
  defaults.horizontalBar,
  baseDefaults(boxOptionsKeys),
  {
    datasets: {
      animation: {
        numbers: {
          type: 'number',
          properties: defaults.bar.datasets.animation.numbers.properties.concat(
            ['q1', 'q3', 'min', 'max', 'median', 'whiskerMin', 'whiskerMax'],
            boxOptionsKeys.filter((c) => !c.endsWith('Color'))
          ),
        },
      },
    },
  },
]);

HorizontalBoxPlotController.register = () => {
  HorizontalBoxPlotController.prototype.dataElementType = BoxAndWiskers.register();
  HorizontalBoxPlotController.prototype.dataElementOptions = HorizontalBarController.prototype.dataElementOptions.concat(
    boxOptionsKeys
  );
  return registerController(HorizontalBoxPlotController);
};

export class HorizontalBoxPlotChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, HorizontalBoxPlotController));
  }
}
HorizontalBoxPlotChart.id = HorizontalBoxPlotController.id;
