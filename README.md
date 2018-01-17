# Chart.js Box and Violin Plot 
[![datavisyn][datavisyn-image]][datavisyn-url] [![NPM Package][npm-image]][npm-url] [![CircleCI][circleci-image]][circleci-url]

Chart.js module for charting box and violin plots

![Box Plot](https://user-images.githubusercontent.com/4129778/33257815-cee715e8-d357-11e7-899b-9f18f5ab7a5c.png)
![Violin Plot](https://user-images.githubusercontent.com/4129778/33257814-cecc222e-d357-11e7-8def-e298b7e655b1.png)

## Install
```bash
npm install --save chartjs chartjs-chart-box-and-violin-plot
```

## Usage
see [Samples](https://github.com/datavisyn/chartjs-chart-box-and-violin-plot/tree/master/samples) on Github

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
     * @default 2
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

    /**
     * padding for a single box or violin
     * less than 1 is interpreted as percent
     * greater than 1 is interpreted as pixel
     * @default 0;
     */
    padding: number;
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

In addition, two new scales were created  `arrayLinear` and `arrayLogarithmic`. They were needed to adapt to the required data structure.

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
<a href="http://datavisyn.io"><img src="https://user-images.githubusercontent.com/5220584/35052732-9efb1de2-fba8-11e7-91fd-8e80216c0dc3.png" align="left" width="200px" hspace="10" vspace="6"></a>
This repository is created by&nbsp;<strong><a href="http://datavisyn.io">datavisyn</a></strong>.
</div>


[datavisyn-image]: https://img.shields.io/badge/datavisyn-io-black.svg
[datavisyn-url]: http://datavisyn.io
[npm-image]: https://badge.fury.io/js/chartjs-chart-box-and-violin-plot.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-box-and-violin-plot 
[circleci-image]: https://circleci.com/gh/datavisyn/chartjs-chart-box-and-violin-plot.svg?style=shield
[circleci-url]: https://circleci.com/gh/datavisyn/chartjs-chart-box-and-violin-plot

