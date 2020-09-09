import { registry } from 'chart.js';
import { BoxPlotController, ViolinController } from './controllers';
import { BoxAndWiskers, Violin } from './elements';

export * from '.';

registry.addControllers(BoxPlotController, ViolinController);
registry.addElements(BoxAndWiskers, Violin);
