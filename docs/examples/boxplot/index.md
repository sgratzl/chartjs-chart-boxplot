---
title: Basic BoxPlot
---

```js{4}
const samples = this.Samples.utils;
const color = Chart.helpers.color;
const b = d3.randomNormal();
const random = (min, max) => () => b() * ((max || 1) - (min || 0)) + (min || 0);
const boxplotData = {
  labels: samples.months({ count: 7 }),
  datasets: [
    {
      label: 'Dataset 1',
      backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
      borderColor: window.chartColors.red,
      borderWidth: 1,
      data: samples.boxplots({ count: 7, random: random }),
      outlierBackgroundColor: '#999999',
    },
    {
      label: 'Dataset 2',
      backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
      borderColor: window.chartColors.blue,
      borderWidth: 1,
      data: samples.boxplotsArray({ count: 7, random: random }),
      outlierBackgroundColor: '#999999',
      lowerBackgroundColor: '#461e7d',
    },
  ],
};

window.onload = () => {
  const ctx = document.getElementById('canvas').getContext('2d');
  const myBar = new Chart(ctx, {
    type: 'boxplot',
    data: boxplotData,
  });

  document.getElementById('randomizeData').addEventListener('click', () => {
    boxplotData.datasets.forEach(function (dataset) {
      dataset.data = samples.boxplots({ count: 7 });
    });
    myBar.update();
  });

  const colorNames = Object.keys(window.chartColors);
  document.getElementById('addDataset').addEventListener('click', () => {
    const colorName = colorNames[boxplotData.datasets.length % colorNames.length];
    const dsColor = window.chartColors[colorName];
    const newDataset = {
      label: 'Dataset ' + boxplotData.datasets.length,
      backgroundColor: color(dsColor).alpha(0.5).rgbString(),
      borderColor: dsColor,
      borderWidth: 1,
      data: samples.boxplots({ count: boxplotData.labels.length }),
    };

    boxplotData.datasets.push(newDataset);
    myBar.update();
  });

  document.getElementById('addData').addEventListener('click', () => {
    if (boxplotData.datasets.length > 0) {
      const month = samples.nextMonth(boxplotData.labels.length);
      boxplotData.labels.push(month);

      for (let index = 0; index < boxplotData.datasets.length; ++index) {
        //window.myBar.addData(randomBoxPlot(), index);
        boxplotData.datasets[index].data.push(samples.randomBoxPlot());
      }

      myBar.update();
    }
  });

  document.getElementById('removeDataset').addEventListener('click', () => {
    boxplotData.datasets.splice(0, 1);
    myBar.update();
  });

  document.getElementById('removeData').addEventListener('click', () => {
    boxplotData.labels.splice(-1, 1); // remove the label first

    boxplotData.datasets.forEach((dataset) => {
      dataset.data.pop();
    });

    myBar.update();
  });
};
```