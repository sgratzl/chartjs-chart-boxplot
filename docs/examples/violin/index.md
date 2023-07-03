---
title: Basic Violin
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
      data: samples.boxplotsArray({ count: 7, random: random, points: 200 }),
    },
    {
      label: 'Dataset 2',
      backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
      borderColor: window.chartColors.blue,
      borderWidth: 1,
      data: samples.boxplotsArray({ count: 7, random: random, points: 1000 }),
    },
  ],
};

window.onload = function () {
  const ctx = document.getElementById('canvas').getContext('2d');
  const myBar = new Chart(ctx, {
    type: 'violin',
    data: boxplotData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Violin Chart',
      },
    },
  });
};
```