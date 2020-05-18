# Chart.js Box and Violin Plot

[![datavisyn][datavisyn-image]][datavisyn-url] [![License: MIT][mit-image]][mit-url] [![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting box and violin plots.

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

four new types: `boxplot`, `horizontalBoxplot`, `violin`, and `horizontalViolin`.

## Config

The config can be done on a per dataset `.data.datasets[0].minStats` or for all datasets under the controllers name. e.g., `.options.boxplot.datasets.minStats`.

```ts
interface IBaseOptions {
  /**
   * statistic measure that should be used for computing the minimal data limit
   * @default 'min'
   */
  minStats: 'min' | 'q1' | 'whiskerMin';

  /**
   * statistic measure that should be used for computing the maximal data limit
   * @default 'max'
   */
  maxStats: 'max' | 'q3' | 'whiskerMax';

  /**
   * from the R doc: this determines how far the plot ‘whiskers’ extend out from
   * the box. If coef is positive, the whiskers extend to the most extreme data
   * point which is no more than coef times the length of the box away from the
   * box. A value of zero causes the whiskers to extend to the data extremes
   * @default 1.5
   */
  coef: number;

  /**
   * the method to compute the quantiles.
   *
   * 7, 'quantiles': the type-7 method as used by R 'quantiles' method.
   * 'hinges' and 'fivenum': the method used by R 'boxplot.stats' method.
   * 'linear': the interpolation method 'linear' as used by 'numpy.percentile' function
   * 'lower': the interpolation method 'lower' as used by 'numpy.percentile' function
   * 'higher': the interpolation method 'higher' as used by 'numpy.percentile' function
   * 'nearest': the interpolation method 'nearest' as used by 'numpy.percentile' function
   * 'midpoint': the interpolation method 'midpoint' as used by 'numpy.percentile' function
   * @default 7
   */
  quantiles:
    | 7
    | 'quantiles'
    | 'hinges'
    | 'fivenum'
    | 'linear'
    | 'lower'
    | 'higher'
    | 'nearest'
    | 'midpoint'
    | ((sortedArr: number[]) => { min: number; q1: number; median: number; q3: number; max: number });
}

interface IBoxplotOptions extends IBaseOptions {
  // no extra options
}

interface IViolinOptions extends IBaseOptions {
  /**
   * number of points that should be samples of the KDE
   * @default 100
   */
  points: number;
}

interface IChartJSOptions {
  boxplot: {
    datasets: {};
  };
}
```

## Styling

The boxplot element is called `boxandwhiskers`. The basic options are from the `rectangle` element. The violin element is called `violin` also based on the `rectangle` element.

```ts
interface IBaseStyling {
  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  backgroundColor: string;

  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  borderColor: string;

  /**
   * @default 1
   * @scriptable
   * @indexable
   */
  borderWidth: number;

  /**
   * item style used to render outliers
   * @default circle
   */
  outlierStyle:
    | 'circle'
    | 'triangle'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'cross'
    | 'crossRot'
    | 'star'
    | 'line'
    | 'dash';

  /**
   * radius used to render outliers
   * @default 2
   * @scriptable
   * @indexable
   */
  outlierRadius: number;

  /**
   * @default see rectangle.backgroundColor
   * @scriptable
   * @indexable
   */
  outlierBackgroundColor: string;

  /**
   * @default see rectangle.borderColor
   * @scriptable
   * @indexable
   */
  outlierBorderColor: string;
  /**
   * @default 1
   * @scriptable
   * @indexable
   */
  outlierBorderWidth: number;

  /**
   * item style used to render items
   * @default circle
   */
  itemStyle:
    | 'circle'
    | 'triangle'
    | 'rect'
    | 'rectRounded'
    | 'rectRot'
    | 'cross'
    | 'crossRot'
    | 'star'
    | 'line'
    | 'dash';

  /**
   * radius used to render items
   * @default 0 so disabled
   * @scriptable
   * @indexable
   */
  itemRadius: number;

  /**
   * background color for items
   * @default see rectangle.backgroundColor
   * @scriptable
   * @indexable
   */
  itemBackgroundColor: string;

  /**
   * border color for items
   * @default see rectangle.borderColor
   * @scriptable
   * @indexable
   */
  itemBorderColor: string;

  /**
   * border width for items
   * @default 0
   * @scriptable
   * @indexable
   */
  itemBorderColor: number;

  /**
   * padding that is added around the bounding box when computing a mouse hit
   * @default 2
   * @scriptable
   * @indexable
   */
  hitPadding: number;

  /**
   * hit radius for hit test of outliers
   * @default 4
   * @scriptable
   * @indexable
   */
  outlierHitRadius: number;
}

interface IBoxPlotStyling extends IBaseStyling {
  /**
   * separate color for the median line
   * @default 'transparent' takes the current borderColor
   * @scriptable
   * @indexable
   */
  medianColor: string;

  /**
   * color the lower half (median-q3) of the box in a different color
   * @default 'transparent' takes the current borderColor
   * @scriptable
   * @indexable
   */
  lowerBackgroundColor: string;
}

interface IViolinElementStyling extends IBaseStyling {
  // no extras
}
```

## Data structure

Both types support that the data is given as an array of numbers `number[]`. The statistics will be automatically computed. In addition, specific summary data structures are supported:

```ts
interface IBaseItem {
  min: number;
  median: number;
  max: number;
  /**
   * values of the raw items used for rendering jittered background points
   */
  items?: number[];
}

interface IBoxPlotItem extends IBaseItem {
  q1: number;
  q3: number;
  whiskerMin?: number;
  whiskerMax?: number;
  /**
   * list of box plot outlier values
   */
  outliers?: number[];
}

interface IKDESamplePoint {
  /**
   * sample value
   */
  v: number;
  /**
   * sample estimation
   */
  estimate: number;
}

interface IViolinItem extends IBaseItem {
  /**
   * samples of the underlying KDE
   */
  coords: IKDESamplePoint[];
}
```

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
import Chart from 'chart.js';
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';

new BoxPlotChart(ctx, {
  data: [...],
});
```

## Development Environment

```sh
npm i -g yarn
yarn set version 2
yarn
yarn pnpify --sdk
```

### Building

```sh
yarn install
yarn build
```

---

<a href="https://www.datavisyn.io"><img src="https://www.datavisyn.io/img/logos/datavisyn-d-logo.png" align="left" width="25px" hspace="10" vspace="6"></a>
developed by **[datavisyn][datavisyn-url]**.

[datavisyn-image]: https://img.shields.io/badge/datavisyn-io-black.svg
[datavisyn-url]: https://www.datavisyn.io
[mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[mit-url]: https://opensource.org/licenses/MIT
[npm-image]: https://badge.fury.io/js/%40sgratzl%2Fchartjs-chart-boxplot.svg
[npm-url]: https://npmjs.org/package/@sgratzl/chartjs-chart-boxplot
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-boxplot/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-boxplot/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
