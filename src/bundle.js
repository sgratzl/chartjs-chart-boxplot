export * from '.';

import {
  BoxPlotController,
  HorizontalBoxPlotController,
  ViolinController,
  HorizontalViolinController,
} from './controllers';

BoxPlotController.register();
HorizontalBoxPlotController.register();
ViolinController.register();
HorizontalViolinController.register();
