import { registry } from '@sgratzl/chartjs-esm-facade';
import { BoxPlotController, ViolinController } from './controllers';
import { BoxAndWiskers, Violin } from './elements';

export * from '.';

registry.addControllers(BoxPlotController, ViolinController);
registry.addElements(BoxAndWiskers, Violin);
