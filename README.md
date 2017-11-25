# Chart.js BoxPlot Charting

Chart.js module for charting boxplots. 

## Chart

two new types: `boxplot` and `horizontalBoxplot`. 

## Styling
The element is called `boxandwhiskers`. The basic options are from the `rectangle` element.

```typescript
interface IBoxPlotStyling {
    /*
    @default rectangle
     */
    backgroundColor: string;
    /*
    @default see rectangle
     */
    strokeColor: string;
    /*
    @default 1
     */
    borderWidth: number;
    
    /*
    @default 2
     */
    outlierRadius: number;
}
```

In addiiton, two new scales were created  boxplotLinear` and `boxplotLogarithmic`. They were needed to adapt to the required data structure.

## Data structure

```typescript
interface IBoxPlotItem {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}
```


## Building

```sh
npm install
npm run build
```
