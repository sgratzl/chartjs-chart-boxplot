# Chart.js BoxPlot Charting

Chart.js module for charting boxplots and violin plots. 


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
