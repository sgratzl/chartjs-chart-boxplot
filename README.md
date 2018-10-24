# Chart.js Box and Violin Plot
[![datavisyn][datavisyn-image]][datavisyn-url] [![NPM Package][npm-image]][npm-url] [![CircleCI][circleci-image]][circleci-url]

Chart.js module for charting box and violin plots

![Box Plot](https://user-images.githubusercontent.com/4129778/42724341-9a6ec554-8770-11e8-99b5-626e34dafdb3.png)
![Violin Plot](https://user-images.githubusercontent.com/4129778/42724342-9a8dbb58-8770-11e8-9a30-3e69d07d3b79.png)


## Install
```bash
npm install --save chart.js chartjs-chart-box-and-violin-plot
```

## Usage
see [Samples](https://github.com/datavisyn/chartjs-chart-box-and-violin-plot/tree/master/samples) on Github

and [CodePen](https://codepen.io/sgratzl/pen/QxoLoY)

## Chart

four new types: `boxplot`, `horizontalBoxplot`, `violin`, and `horizontalViolin`.

## Styling
The boxplot element is called `boxandwhiskers`. The basic options are from the `rectangle` element. The violin element is called `violin` also based on the `rectangle` element.

```typescript
interface IBaseStyling {
  /**
   * @default see rectangle
   */
  backgroundColor: string;
  /**
   * @default see rectangle
   */
  strokeColor: string;
  /**
   * @default 1
   */
  borderWidth: number;

  /**
   * radius used to render outliers
   * @default 2
   */
  outlierRadius: number;

  /**
   * @default see rectangle.backgroundColor
   */
  outlierColor: string;

  /**
   * radius used to render items
   * @default 0 so disabled
   */
  itemRadius: number;

  /**
   * item style used to render items
   * @default circle
   */
  itemStyle: 'circle'|'triangle'|'rect'|'rectRounded'|'rectRot'|'cross'|'crossRot'|'star'|'line'|'dash';

  /*
   * background color for items
   * @default see rectangle backgroundColor
   */
  itemBackgroundColor: string;

  /*
   * border color for items
   * @default see rectangle backgroundColor
   */
  itemBorderColor: string;
}

interface IBoxPlotStyling extends IBaseStyling {
  // no extra styling options
}

interface IViolinStyling extends IBaseStyling {
  /**
  * number of sample points of the underlying KDE for creating the violin plot
  * @default 100
  */
  points: number;
}
```

In addition, two new scales were created `arrayLinear` and `arrayLogarithmic`. They were needed to adapt to the required data structure.

## Scale Options

Both `arrayLinear` and `arrayLogarithmic` support the two additional options to their regular counterparts:

```typescript
interface IArrayLinearScale {
  ticks: {
    /**
     * statistic measure that should be used for computing the minimal data limit
     * @default 'min'
     */
    minStats: 'min'|'q1'|'whiskerMin';

    /**
     * statistic measure that should be used for computing the maximal data limit
     * @default 'max'
     */
    maxStats: 'max'|'q3'|'whiskerMax';
  };
}
```

## Data structure

Both types support that the data is given as an array of numbers `number[]`. The statistics will be automatically computed. In addition, specific summary data structures are supported:


```typescript
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

## Building

```sh
npm install
npm run build
```


***

<div style="display:flex;align-items:center">
  <a href="http://datavisyn.io"><img src="https://user-images.githubusercontent.com/1711080/37700685-bcbb18c6-2cec-11e8-9b6f-f49c9ef6c167.png" align="left" width="50px" hspace="10" vspace="6"></a>
  Developed by &nbsp;<strong><a href="http://datavisyn.io">datavisyn</a></strong>.
</div>


[datavisyn-image]: https://img.shields.io/badge/datavisyn-io-black.svg
[datavisyn-url]: http://datavisyn.io
[npm-image]: https://badge.fury.io/js/chartjs-chart-box-and-violin-plot.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-box-and-violin-plot
[circleci-image]: https://circleci.com/gh/datavisyn/chartjs-chart-box-and-violin-plot.svg?style=shield
[circleci-url]: https://circleci.com/gh/datavisyn/chartjs-chart-box-and-violin-plot

