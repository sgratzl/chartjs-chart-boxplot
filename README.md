# Chart.js Box and Violin Plot

[![License: MIT][mit-image]][mit-url] [![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting box and violin plots. This is a maintained fork of [@datavisyn/chartjs-chart-box-and-violin-plot](https://github.com/datavisyn/chartjs-chart-box-and-violin-plot), which I originally developed during my time at datavisyn.

**Works only with Chart.js >= 3.0.0**

![Box Plot](https://user-images.githubusercontent.com/4129778/42724341-9a6ec554-8770-11e8-99b5-626e34dafdb3.png)
![Violin Plot](https://user-images.githubusercontent.com/4129778/42724342-9a8dbb58-8770-11e8-9a30-3e69d07d3b79.png)

## Install

```bash
npm install --save chart.js@next @sgratzl/chartjs-chart-boxplot@next
```

## Usage

see [Samples](https://github.com/sgratzl/chartjs-chart-box-and-violin-plot/tree/master/samples) on Github

and [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/QxoLoY)

## Chart

four new types: `boxplot` and `violin`.

## Config

The config can be done on a per dataset `.data.datasets[0].minStats` or for all datasets under the controllers name. e.g., `.options.boxplot.datasets.minStats`.

see https://github.com/sgratzl/chartjs-chart-boxplot/blob/develop/src/data.ts#L100-L147

## Data structure

Both types support that the data is given as an array of numbers `number[]`. The statistics will be automatically computed. In addition, specific summary data structures are supported:

see https://github.com/sgratzl/chartjs-chart-boxplot/blob/develop/src/data.ts#L24-L49

## Tooltips

In order to simplify the customization of the tooltips the tooltip item given to the tooltip callbacks was improved. The default `toString()` behavior should be fine in most cases. The tooltip item has the following structure:

```ts
interface ITooltipItem {
  label: string; // original
  value: {
    raw: IBoxPlotItem | IViolinItem;
    /**
     * in case an outlier is hovered this will contains its index
     * @default -1
     */
    hoveredOutlierRadius: number;
    /**
     * toString function with a proper default implementation, which is used implicitly
     */
    toString(): string;

    min: string;
    median: string;
    max: string;
    items?: string[];

    //... the formatted version of different attributes IBoxPlotItem or ViolinItem
  };
}
```

### ESM and Tree Shaking

The ESM build of the library supports tree shaking thus having no side effects. As a consequence the chart.js library won't be automatically manipulated nor new controllers automatically registered. One has to manually import and register them.

Variant A:

```js
import Chart from 'chart.js';
import { BoxPlotController } from '@sgratzl/chartjs-chart-boxplot';

// register controller in chart.js and ensure the defaults are set
BoxPlotController.register();
...

new Chart(ctx, {
  type: BoxPlotController.id,
  data: [...],
});
```

Variant B:

```js
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';

new BoxPlotChart(ctx, {
  data: [...],
});
```

## Development Environment

```sh
npm i -g yarn
yarn set version 2
cat .yarnrc_patch.yml >> .yarnrc.yml
yarn
yarn pnpify --sdk
```

### Common commands

```sh
yarn compile
yarn test
yarn lint
yarn fix
yarn build
yarn docs
yarn release
yarn release:pre
```

## Credits

Original credits belong to [@datavisyn](https://www.datavisyn.io).

[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[npm-image]: https://badge.fury.io/js/%40sgratzl%2Fchartjs-chart-boxplot.svg
[npm-url]: https://npmjs.org/package/@sgratzl/chartjs-chart-boxplot
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-boxplot/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-boxplot/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
